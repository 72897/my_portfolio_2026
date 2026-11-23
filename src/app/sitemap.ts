import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import Project from "@/models/Project";
import { siteConfig, projects as fallbackProjects } from "@/lib/constants";

// Rebuild hourly so new blog posts and projects show up without a redeploy.
export const revalidate = 3600;

type SlugDoc = { slug: string; updatedAt?: Date };

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
  "/resume",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // No lastModified here: stamping every static page with the build time
  // teaches crawlers to ignore the field.
  const staticUrls: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  // /projects/[slug] serves a project from the database or, failing that, from
  // constants.ts, so both sets of slugs are valid URLs.
  const projectModified = new Map<string, Date | undefined>(
    fallbackProjects.map((project) => [project.slug, undefined])
  );
  let blogUrls: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();

    const blogs = await Blog.find({ published: true }).select("slug updatedAt").lean<SlugDoc[]>();
    blogUrls = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    const projects = await Project.find({}).select("slug updatedAt").lean<SlugDoc[]>();
    for (const project of projects) {
      projectModified.set(project.slug, project.updatedAt);
    }
  } catch (error) {
    console.error("Sitemap generation database error:", error);
  }

  const projectUrls: MetadataRoute.Sitemap = [...projectModified].map(([slug, lastModified]) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticUrls, ...blogUrls, ...projectUrls];
}
