import { NextResponse } from "next/server";
import type { Model } from "mongoose";
import type { z } from "zod";
import dbConnect from "@/lib/db";
import {
  FALLBACK_HEADER,
  HttpError,
  assertObjectId,
  errorResponse,
  isObjectId,
  jsonError,
  parseBody,
  requireSession,
} from "./http";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = Model<any>;
type StaticItem = object;
type RouteContext = { params: Promise<{ id: string }> };

interface ListFilter {
  /** MongoDB filter built from the query string. */
  query: Record<string, unknown>;
  /** The same filter for the static copy. */
  matches: (item: StaticItem) => boolean;
}

export interface ResourceOptions {
  /** Singular name used in messages, e.g. "Project". */
  label: string;
  model: AnyModel;
  schema: z.ZodObject;
  sort: Record<string, 1 | -1>;
  /** Static copy served to the public when the database has nothing to offer. */
  staticItems?: () => StaticItem[];
  /** Mongoose `select` string, e.g. to drop fields that are no longer part of the contract. */
  select?: string;
  filter?: (params: URLSearchParams) => ListFilter;
  /** Lets GET /[id] also match this field, e.g. "slug". */
  lookupField?: string;
  /** Fields that are removed from the document when sent as "". */
  clearable?: string[];
  maxItems?: number;
}

const DEFAULT_MAX_ITEMS = 500;

/**
 * `?source=db` (used by the admin panel) turns the static fallback off, so
 * the admin never shows static rows that have no database id.
 */
function wantsDatabaseOnly(req: Request): boolean {
  return new URL(req.url).searchParams.get("source") === "db";
}

export function staticJson(items: unknown) {
  return NextResponse.json(items, { headers: { [FALLBACK_HEADER]: "static" } });
}

function splitClearable(data: Record<string, unknown>, clearable: string[] = []) {
  const set: Record<string, unknown> = {};
  const unset: Record<string, 1> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (value === "" && clearable.includes(key)) unset[key] = 1;
    else set[key] = value;
  }
  return { set, unset };
}

export function collectionHandlers(options: ResourceOptions) {
  const { label, model, schema, sort, staticItems, select, filter, clearable } = options;
  const maxItems = options.maxItems ?? DEFAULT_MAX_ITEMS;

  async function GET(req: Request) {
    const databaseOnly = wantsDatabaseOnly(req) || !staticItems;
    const listFilter = filter?.(new URL(req.url).searchParams);
    const fallback = () => {
      const items = staticItems?.() ?? [];
      return staticJson(listFilter ? items.filter(listFilter.matches) : items);
    };

    try {
      await dbConnect();
      const items = await model
        .find(listFilter?.query ?? {})
        .select(select ?? "")
        .sort(sort)
        .limit(maxItems)
        .lean();

      if (items.length === 0 && !databaseOnly && (await model.estimatedDocumentCount()) === 0) {
        return fallback();
      }
      return NextResponse.json(items);
    } catch (error) {
      if (!databaseOnly) {
        console.error(`${label} list: serving static data:`, error instanceof Error ? error.message : error);
        return fallback();
      }
      return errorResponse(error, `${label} list`);
    }
  }

  async function POST(req: Request) {
    try {
      await requireSession();
      const data = await parseBody(req, schema);
      const { set } = splitClearable(data, clearable);
      await dbConnect();
      const created = await model.create(set);
      return NextResponse.json(created, { status: 201 });
    } catch (error) {
      return errorResponse(error, `${label} create`);
    }
  }

  return { GET, POST };
}

export function itemHandlers(options: ResourceOptions) {
  const { label, model, schema, staticItems, select, lookupField, clearable } = options;
  const notFound = () => jsonError(404, `${label} not found`);

  async function GET(req: Request, { params }: RouteContext) {
    const { id } = await params;
    const byId = isObjectId(id);
    if (!byId && !lookupField) return notFound();

    const fromStatic = () => {
      if (!lookupField || wantsDatabaseOnly(req)) return undefined;
      return staticItems?.().find(
        (item) => (item as Record<string, unknown>)[lookupField] === id.toLowerCase()
      );
    };

    try {
      await dbConnect();
      const query = byId ? { _id: id } : { [lookupField as string]: id.toLowerCase() };
      const item = await model.findOne(query).select(select ?? "").lean();
      if (item) return NextResponse.json(item);

      const staticItem = (await model.estimatedDocumentCount()) === 0 ? fromStatic() : undefined;
      return staticItem ? staticJson(staticItem) : notFound();
    } catch (error) {
      const staticItem = fromStatic();
      if (staticItem && !(error instanceof HttpError)) return staticJson(staticItem);
      return errorResponse(error, `${label} read`);
    }
  }

  async function PUT(req: Request, { params }: RouteContext) {
    try {
      await requireSession();
      const { id } = await params;
      assertObjectId(id, label);
      const data = await parseBody(req, schema.partial());
      const { set, unset } = splitClearable(data, clearable);

      const update: Record<string, unknown> = {};
      if (Object.keys(set).length > 0) update.$set = set;
      if (Object.keys(unset).length > 0) update.$unset = unset;

      await dbConnect();
      const updated = await model
        .findByIdAndUpdate(id, update, { returnDocument: "after", runValidators: true })
        .select(select ?? "")
        .lean();
      return updated ? NextResponse.json(updated) : notFound();
    } catch (error) {
      return errorResponse(error, `${label} update`);
    }
  }

  async function DELETE(_req: Request, { params }: RouteContext) {
    try {
      await requireSession();
      const { id } = await params;
      assertObjectId(id, label);
      await dbConnect();
      const deleted = await model.findByIdAndDelete(id).lean();
      return deleted
        ? NextResponse.json({ message: `${label} deleted successfully` })
        : notFound();
    } catch (error) {
      return errorResponse(error, `${label} delete`);
    }
  }

  return { GET, PUT, DELETE };
}
