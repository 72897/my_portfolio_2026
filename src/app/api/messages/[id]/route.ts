import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import {
  assertObjectId,
  errorResponse,
  jsonError,
  parseBody,
  requireSession,
} from '@/app/api/_lib/http';
import { messageUpdateSchema } from '@/app/api/_lib/schemas';

type RouteContext = { params: Promise<{ id: string }> };

const notFound = () => jsonError(404, 'Message not found');

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await requireSession();
    const { id } = await params;
    assertObjectId(id, 'Message');
    const { read } = await parseBody(req, messageUpdateSchema);

    await dbConnect();
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { $set: { read: read ?? true } },
      { returnDocument: 'after', runValidators: true }
    ).lean();
    return message ? NextResponse.json(message) : notFound();
  } catch (error) {
    return errorResponse(error, 'Message update');
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    await requireSession();
    const { id } = await params;
    assertObjectId(id, 'Message');
    await dbConnect();
    const message = await ContactMessage.findByIdAndDelete(id).lean();
    return message ? NextResponse.json({ message: 'Message deleted successfully' }) : notFound();
  } catch (error) {
    return errorResponse(error, 'Message delete');
  }
}
