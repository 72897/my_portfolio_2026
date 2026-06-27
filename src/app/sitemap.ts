import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import Project from "@/models/Project";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kunalsingh.dev";

  // Static routes
  const staticPaths = [
    "",
    "/about",
    "/skills",
    "/experience",
    "/projects",
    "/github",
    "/leetcode",
    "/certificates",
    "/blog",
    "/contact",
  ];

  const staticUrls = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  let blogUrls: Array<{ url: string; lastModified: Date; changeFrequency: "monthly"; priority: number }> = [];
  let projectUrls: Array<{ url: string; lastModified: Date; changeFrequency: "monthly"; priority: number }> = [];

  try {
    await dbConnect();

    // Fetch dynamic published blogs
    const blogs = await Blog.find({ published: true }).select("slug updatedAt").lean();
    blogUrls = blogs.map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // Fetch dynamic projects
    const projects = await Project.find({}).select("slug updatedAt").lean();
    projectUrls = projects.map((project: any) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap generation database error:", error);
  }

  return [...staticUrls, ...blogUrls, ...projectUrls];
}
