import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import { staticJson } from '@/app/api/_lib/crud';
import { errorResponse, jsonError, parseBody, requireSession } from '@/app/api/_lib/http';
import { profileSchema } from '@/app/api/_lib/schemas';
import { staticProfile } from '@/app/api/_lib/static-data';

// `?source=db` (admin settings) returns only what is stored: 404 when no
// profile has been saved, 503 when the database is down.
export async function GET(req: Request) {
  const databaseOnly = new URL(req.url).searchParams.get('source') === 'db';
  try {
    await dbConnect();
    const profile = await Profile.findOne().lean();
    if (profile) return NextResponse.json(profile);
    return databaseOnly ? jsonError(404, 'Profile not found') : staticJson(staticProfile());
  } catch (error) {
    if (databaseOnly) return errorResponse(error, 'Profile read');
    console.error('Profile: serving static data:', error instanceof Error ? error.message : error);
    return staticJson(staticProfile());
  }
}

export async function PUT(req: Request) {
  try {
    await requireSession();
    const data = await parseBody(req, profileSchema);

    await dbConnect();
    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: data },
      { returnDocument: 'after', runValidators: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return NextResponse.json(profile);
  } catch (error) {
    return errorResponse(error, 'Profile update');
  }
}
