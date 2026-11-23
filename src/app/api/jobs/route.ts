import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JobPost from '@/models/JobPost';
import { staticJson } from '@/app/api/_lib/crud';
import { errorResponse, optionalSession, parseBody, requireSession } from '@/app/api/_lib/http';
import { jobSchema } from '@/app/api/_lib/schemas';

const MAX_JOBS = 500;

// Visitors get entries marked public only; a signed-in admin gets all of them.
export async function GET() {
  const session = await optionalSession();
  try {
    await dbConnect();
    const jobs = await JobPost.find(session ? {} : { isPublic: true })
      .sort({ appliedDate: -1, createdAt: -1 })
      .limit(MAX_JOBS)
      .lean();
    return NextResponse.json(jobs);
  } catch (error) {
    if (!session) {
      console.error('Jobs list: database unavailable:', error instanceof Error ? error.message : error);
      return staticJson([]);
    }
    return errorResponse(error, 'Jobs list');
  }
}

export async function POST(req: Request) {
  try {
    await requireSession();
    const data = await parseBody(req, jobSchema);
    await dbConnect();
    const job = await JobPost.create({ ...data, appliedDate: data.appliedDate ?? undefined });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return errorResponse(error, 'Job create');
  }
}
