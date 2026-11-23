import { z } from "zod";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/models/Project";
import { EXPERIENCE_TYPES } from "@/models/Experience";
import { JOB_STATUSES, JOB_TYPES } from "@/models/JobPost";

// No `.default()` anywhere: update routes use `.partial()`, and a default
// would overwrite a stored value whenever a field is left out of the request.

const text = (max: number) => z.string().trim().max(max);
const requiredText = (max: number) => text(max).min(1, "Required");
const stringList = (maxItems: number, maxLength: number) =>
  z.array(requiredText(maxLength)).max(maxItems);
const order = z.number().int().min(0).max(100_000);

const httpUrl = text(2000).refine((value) => value === "" || /^https?:\/\/\S+$/i.test(value), {
  message: "Must be an http(s) URL",
});
/** A site-relative path such as /images/x.png, or an http(s) URL. */
const assetUrl = text(2000).refine(
  (value) => value === "" || /^https?:\/\/\S+$/i.test(value) || /^\/[^\s/]\S*$/.test(value),
  { message: "Must be a path starting with / or an http(s) URL" }
);
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");
const email = z.string().trim().toLowerCase().max(254).pipe(z.email("Invalid email address"));
const hexColor = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex colour like #6366f1");
const optionalDate = z
  .union([z.literal(""), z.null(), z.coerce.date()])
  .transform((value) => (value instanceof Date ? value : null));

export const projectSchema = z.object({
  title: requiredText(200),
  slug,
  description: requiredText(1000),
  longDescription: text(5000).optional(),
  techStack: stringList(40, 60),
  features: stringList(40, 400),
  githubUrl: httpUrl.optional(),
  liveUrl: httpUrl.optional(),
  image: assetUrl.optional(),
  screenshots: z.array(assetUrl).max(20).optional(),
  category: z.enum(PROJECT_CATEGORIES),
  featured: z.boolean().optional(),
  order: order.optional(),
  role: text(100).optional(),
  year: text(20).optional(),
  // "" clears the stored status.
  status: z.union([z.enum(PROJECT_STATUSES), z.literal("")]).optional(),
});

export const certificateSchema = z.object({
  title: requiredText(200),
  organization: requiredText(200),
  issueDate: text(40).optional(),
  credentialUrl: httpUrl.optional(),
  image: assetUrl.optional(),
  description: text(1000).optional(),
  order: order.optional(),
});

export const experienceSchema = z.object({
  company: requiredText(200),
  role: requiredText(200),
  type: z.enum(EXPERIENCE_TYPES),
  location: text(200).optional(),
  startDate: requiredText(40),
  endDate: text(40).optional(),
  current: z.boolean().optional(),
  bullets: stringList(20, 600),
  technologies: stringList(40, 60),
  order: order.optional(),
});

export const skillSchema = z.object({
  name: requiredText(80),
  category: requiredText(80),
  icon: text(60).optional(),
  order: order.optional(),
});

export const educationSchema = z.object({
  institution: requiredText(200),
  degree: requiredText(200),
  location: text(200).optional(),
  period: requiredText(60),
  grade: text(40).optional(),
  coursework: stringList(40, 120).optional(),
  order: order.optional(),
});

export const blogSchema = z.object({
  title: requiredText(200),
  slug,
  description: requiredText(1000),
  content: z.string().min(1, "Required").max(100_000),
  coverImage: assetUrl.optional(),
  tags: stringList(20, 40).optional(),
  source: z.enum(["article", "linkedin"]).optional(),
  externalUrl: httpUrl.optional(),
  published: z.boolean().optional(),
  publishedAt: optionalDate.optional(),
});

export const jobSchema = z.object({
  company: requiredText(200),
  role: requiredText(200),
  type: z.enum(JOB_TYPES),
  location: text(200).optional(),
  description: text(5000).optional(),
  applicationUrl: httpUrl.optional(),
  status: z.enum(JOB_STATUSES).optional(),
  isPublic: z.boolean().optional(),
  appliedDate: optionalDate.optional(),
});

export const profileSchema = z.object({
  name: requiredText(100),
  title: requiredText(200),
  bio: requiredText(2000),
  email,
  phone: text(30).optional(),
  location: text(200).optional(),
  logoColor1: hexColor.optional(),
  logoColor2: hexColor.optional(),
  linkedinUrl: httpUrl.optional(),
  githubUrl: httpUrl.optional(),
  githubUsername: text(60).optional(),
  leetcodeUrl: httpUrl.optional(),
  leetcodeUsername: text(60).optional(),
  resumeUrl: assetUrl.optional(),
});

// downloadCount is deliberately absent: only the download route changes it.
export const resumeSchema = z.object({
  summary: requiredText(3000),
  pdfUrl: assetUrl.min(1, "Required"),
  highlights: z
    .object({
      experience: text(500),
      skills: text(500),
      projects: text(500),
      education: text(500),
      certifications: text(500),
    })
    .partial()
    .optional(),
});

export const contactSchema = z.object({
  name: requiredText(100),
  email,
  subject: requiredText(200),
  message: requiredText(5000),
});

export const messageUpdateSchema = z.object({
  read: z.boolean().optional(),
});

export const CHAT_MAX_MESSAGE_CHARS = 2000;
export const CHAT_MAX_HISTORY = 12;

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(8000),
      })
    )
    .min(1)
    .max(200),
  // Both are clamped by the route rather than rejected.
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
});
