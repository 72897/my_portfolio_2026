import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { staticJson } from '@/app/api/_lib/crud';
import { errorResponse, optionalSession, parseBody, requireSession } from '@/app/api/_lib/http';
import { blogSchema } from '@/app/api/_lib/schemas';
import { readingTimeMinutes } from '@/app/api/_lib/blog';

const MAX_POSTS = 200;

// Visitors get published posts only; a signed-in admin gets drafts too.
export async function GET() {
  const session = await optionalSession();
  try {
    await dbConnect();
    const blogs = await Blog.find(session ? {} : { published: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(MAX_POSTS)
      .lean();
    return NextResponse.json(blogs);
  } catch (error) {
    // There is no static copy of the blog, so visitors get an empty list.
    if (!session) {
      console.error('Blog list: database unavailable:', error instanceof Error ? error.message : error);
      return staticJson([]);
    }
    return errorResponse(error, 'Blog list');
  }
}

export async function POST(req: Request) {
  try {
    await requireSession();
    const data = await parseBody(req, blogSchema);
    await dbConnect();
    const blog = await Blog.create({
      ...data,
      publishedAt: data.publishedAt ?? (data.published ? new Date() : undefined),
      readingTime: readingTimeMinutes(data.content),
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return errorResponse(error, 'Blog create');
  }
}
