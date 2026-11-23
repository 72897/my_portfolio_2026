import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import {
  assertObjectId,
  errorResponse,
  isObjectId,
  jsonError,
  optionalSession,
  parseBody,
  requireSession,
} from '@/app/api/_lib/http';
import { blogSchema } from '@/app/api/_lib/schemas';
import { readingTimeMinutes } from '@/app/api/_lib/blog';

type RouteContext = { params: Promise<{ id: string }> };

const notFound = () => jsonError(404, 'Blog not found');

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await dbConnect();

    const blog = await Blog.findOne(
      isObjectId(id) ? { _id: id } : { slug: id.toLowerCase() }
    ).lean();

    // A draft answers 404 to visitors so its existence is not revealed.
    if (!blog || (!blog.published && !(await optionalSession()))) return notFound();
    return NextResponse.json(blog);
  } catch (error) {
    return errorResponse(error, 'Blog read');
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await requireSession();
    const { id } = await params;
    assertObjectId(id, 'Blog');
    const data = await parseBody(req, blogSchema.partial());

    await dbConnect();
    const existing = await Blog.findById(id).select('publishedAt').lean();
    if (!existing) return notFound();

    // findByIdAndUpdate skips the save hooks on the model, so the values
    // they would set are worked out here.
    const update: Record<string, unknown> = { ...data };
    if (data.content !== undefined) update.readingTime = readingTimeMinutes(data.content);
    if (!data.publishedAt) delete update.publishedAt;
    if (data.published && !data.publishedAt && !existing.publishedAt) {
      update.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $set: update },
      { returnDocument: 'after', runValidators: true }
    ).lean();
    return blog ? NextResponse.json(blog) : notFound();
  } catch (error) {
    return errorResponse(error, 'Blog update');
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    await requireSession();
    const { id } = await params;
    assertObjectId(id, 'Blog');
    await dbConnect();
    const blog = await Blog.findByIdAndDelete(id).lean();
    return blog ? NextResponse.json({ message: 'Blog deleted successfully' }) : notFound();
  } catch (error) {
    return errorResponse(error, 'Blog delete');
  }
}
