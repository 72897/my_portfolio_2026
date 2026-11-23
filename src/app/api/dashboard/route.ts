import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import Certificate from '@/models/Certificate';
import Experience from '@/models/Experience';
import Skill from '@/models/Skill';
import Blog from '@/models/Blog';
import ContactMessage from '@/models/ContactMessage';
import JobPost from '@/models/JobPost';
import Education from '@/models/Education';
import { errorResponse, requireSession } from '@/app/api/_lib/http';

export async function GET() {
  try {
    await requireSession();
    await dbConnect();

    const [
      projects,
      certificates,
      experiences,
      skills,
      blogs,
      publishedBlogs,
      messages,
      unreadMessages,
      jobs,
      education,
    ] = await Promise.all([
      Project.countDocuments(),
      Certificate.countDocuments(),
      Experience.countDocuments(),
      Skill.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ published: true }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
      JobPost.countDocuments(),
      Education.countDocuments(),
    ]);

    return NextResponse.json({
      projects,
      certificates,
      experiences,
      skills,
      blogs,
      publishedBlogs,
      messages,
      unreadMessages,
      jobs,
      education,
    });
  } catch (error) {
    return errorResponse(error, 'Dashboard');
  }
}
