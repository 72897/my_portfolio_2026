import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { enforceRateLimit, errorResponse, parseBody } from '@/app/api/_lib/http';
import { contactSchema } from '@/app/api/_lib/schemas';

const MAX_MESSAGES_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: Request) {
  try {
    enforceRateLimit(req, 'contact', MAX_MESSAGES_PER_WINDOW, WINDOW_MS);
    const data = await parseBody(req, contactSchema);

    await dbConnect();
    const contactMessage = await ContactMessage.create(data);

    return NextResponse.json(
      { message: 'Message sent successfully', id: contactMessage._id },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error, 'Contact');
  }
}
