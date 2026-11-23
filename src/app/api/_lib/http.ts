import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { DbUnavailableError } from "@/lib/db";
import { clientIp, rateLimit } from "./rate-limit";

/** Marks a response whose body is static site data rather than live data. */
export const FALLBACK_HEADER = "X-Data-Source";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function jsonError(status: number, error: string, details?: unknown) {
  return NextResponse.json(details === undefined ? { error } : { error, details }, { status });
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new HttpError(401, "Unauthorized");
  return session;
}

/** Session lookup for public routes that only show more to a signed-in admin. */
export async function optionalSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

export async function parseBody<T extends z.ZodType>(req: Request, schema: T): Promise<z.infer<T>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new HttpError(400, "Request body must be valid JSON");
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new HttpError(
      400,
      "Validation failed",
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
    );
  }
  return result.data;
}

// mongoose.isValidObjectId also accepts any 12-character string, which would
// swallow slugs such as "tiq-platform".
export function isObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function assertObjectId(id: string, label: string) {
  if (!isObjectId(id)) throw new HttpError(404, `${label} not found`);
}

export function enforceRateLimit(req: Request, scope: string, limit: number, windowMs: number) {
  const result = rateLimit(`${scope}:${clientIp(req)}`, limit, windowMs);
  if (!result.ok) {
    throw new HttpError(429, `Too many requests. Try again in ${result.retryAfterSeconds}s.`);
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: unknown }).code === 11000;
}

/** Maps a thrown value to a JSON response without leaking internals. */
export function errorResponse(error: unknown, label: string) {
  if (error instanceof HttpError) {
    return jsonError(error.status, error.message, error.details);
  }
  if (error instanceof DbUnavailableError) {
    console.error(`${label}: ${error.message}`);
    return jsonError(503, "Database is unavailable");
  }
  if (error instanceof mongoose.Error.ValidationError) {
    return jsonError(
      400,
      "Validation failed",
      Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }))
    );
  }
  if (error instanceof mongoose.Error.CastError) {
    return jsonError(400, `Invalid value for ${error.path}`);
  }
  if (isDuplicateKeyError(error)) {
    return jsonError(409, "An entry with the same unique value already exists");
  }
  console.error(`${label}:`, error);
  return jsonError(500, "Internal server error");
}
