import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { after, NextResponse } from 'next/server';
import dbConnect, { isDbConfigured } from '@/lib/db';
import Resume from '@/models/Resume';
import { enforceRateLimit, errorResponse, jsonError } from '@/app/api/_lib/http';
import { RESUME_PDF_FILENAME, RESUME_PDF_URL } from '@/app/api/_lib/static-data';

const RESUME_PDF_PATH = path.join(process.cwd(), 'public', 'resume', RESUME_PDF_FILENAME);

async function countDownload() {
  const resume = await Resume.findOneAndUpdate(
    {},
    { $inc: { downloadCount: 1 } },
    { returnDocument: 'after' }
  ).lean();
  return resume?.downloadCount ?? null;
}

/** Sends the resume PDF as a download and counts it when a database is available. */
export async function GET(req: Request) {
  try {
    enforceRateLimit(req, 'resume-download', 20, 60_000);
  } catch (error) {
    return errorResponse(error, 'Resume download');
  }

  if (isDbConfigured()) {
    after(async () => {
      try {
        await dbConnect();
        await countDownload();
      } catch (error) {
        console.error('Resume download count failed:', error instanceof Error ? error.message : error);
      }
    });
  }

  try {
    const file = await readFile(RESUME_PDF_PATH);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${RESUME_PDF_FILENAME}"`,
        'Content-Length': String(file.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    // The file is also served statically from /public; use that copy if the
    // function cannot read it from disk.
    return NextResponse.redirect(new URL(RESUME_PDF_URL, req.url), 307);
  }
}

/** Counts a download without sending the file, for links that point at the static PDF. */
export async function POST(req: Request) {
  try {
    enforceRateLimit(req, 'resume-download', 20, 60_000);
    await dbConnect();
    const downloadCount = await countDownload();
    if (downloadCount === null) return jsonError(404, 'Resume not found');
    return NextResponse.json({ success: true, downloadCount });
  } catch (error) {
    return errorResponse(error, 'Resume download count');
  }
}
