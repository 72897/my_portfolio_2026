import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import { staticJson } from '@/app/api/_lib/crud';
import { errorResponse, parseBody, requireSession } from '@/app/api/_lib/http';
import { resumeSchema } from '@/app/api/_lib/schemas';
import { RESUME_PDF_URL } from '@/app/api/_lib/static-data';

const emptyResume = () => ({
  summary: '',
  pdfUrl: RESUME_PDF_URL,
  highlights: {
    experience: '',
    skills: '',
    projects: '',
    education: '',
    certifications: '',
  },
  downloadCount: 0,
});

export async function GET(req: Request) {
  const databaseOnly = new URL(req.url).searchParams.get('source') === 'db';
  try {
    await dbConnect();
    const resume = await Resume.findOne().lean();
    return resume ? NextResponse.json(resume) : staticJson(emptyResume());
  } catch (error) {
    if (databaseOnly) return errorResponse(error, 'Resume read');
    console.error('Resume: serving defaults:', error instanceof Error ? error.message : error);
    return staticJson(emptyResume());
  }
}

export async function PUT(req: Request) {
  try {
    await requireSession();
    const { highlights, ...fields } = await parseBody(req, resumeSchema);

    // Dotted paths so a partial highlights object does not wipe the others.
    const update: Record<string, unknown> = { ...fields, lastUpdated: new Date() };
    for (const [key, value] of Object.entries(highlights ?? {})) {
      update[`highlights.${key}`] = value;
    }

    await dbConnect();
    const resume = await Resume.findOneAndUpdate(
      {},
      { $set: update },
      { returnDocument: 'after', runValidators: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return NextResponse.json(resume);
  } catch (error) {
    return errorResponse(error, 'Resume update');
  }
}
