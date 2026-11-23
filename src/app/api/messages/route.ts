import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { errorResponse, requireSession } from '@/app/api/_lib/http';

const MAX_MESSAGES = 500;

export async function GET() {
  try {
    await requireSession();
    await dbConnect();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(MAX_MESSAGES)
      .lean();
    return NextResponse.json(messages);
  } catch (error) {
    return errorResponse(error, 'Messages list');
  }
}
