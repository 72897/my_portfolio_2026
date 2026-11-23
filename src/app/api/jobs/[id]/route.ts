import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JobPost from '@/models/JobPost';
import {
  assertObjectId,
  errorResponse,
  jsonError,
  optionalSession,
  parseBody,
  requireSession,
} from '@/app/api/_lib/http';
import { jobSchema } from '@/app/api/_lib/schemas';

type RouteContext = { params: Promise<{ id: string }> };

const notFound = () => jsonError(404, 'Job not found');

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    assertObjectId(id, 'Job');
    await dbConnect();

    const job = await JobPost.findById(id).lean();
    // A private entry answers 404 to visitors so its existence is not revealed.
    if (!job || (!job.isPublic && !(await optionalSession()))) return notFound();
    return NextResponse.json(job);
  } catch (error) {
    return errorResponse(error, 'Job read');
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await requireSession();
    const { id } = await params;
    assertObjectId(id, 'Job');
    const { appliedDate, ...fields } = await parseBody(req, jobSchema.partial());

    // The form sends "" for an empty date, which arrives here as null and
    // removes the stored date.
    const update: Record<string, unknown> = {
      $set: appliedDate ? { ...fields, appliedDate } : fields,
    };
    if (appliedDate === null) update.$unset = { appliedDate: 1 };

    await dbConnect();
    const job = await JobPost.findByIdAndUpdate(id, update, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();
    return job ? NextResponse.json(job) : notFound();
  } catch (error) {
    return errorResponse(error, 'Job update');
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    await requireSession();
    const { id } = await params;
    assertObjectId(id, 'Job');
    await dbConnect();
    const job = await JobPost.findByIdAndDelete(id).lean();
    return job ? NextResponse.json({ message: 'Job deleted successfully' }) : notFound();
  } catch (error) {
    return errorResponse(error, 'Job delete');
  }
}
