import {
  certificates,
  education,
  experiences,
  projects,
  siteConfig,
  skillCategories,
} from "@/lib/constants";

export const RESUME_PDF_FILENAME = "Resume_Kunal_Singh.pdf";
export const RESUME_PDF_URL = `/resume/${RESUME_PDF_FILENAME}`;

// Static copies of the site content, shaped like the documents the database
// returns, for when the database is missing, unreachable or not yet seeded.

const withOrder = <T extends object>(items: readonly T[]) =>
  items.map((item, index) => ({ ...item, order: index + 1 }));

export const staticProjects = () => withOrder(projects);
export const staticExperiences = () => withOrder(experiences);
export const staticCertificates = () => withOrder(certificates);
export const staticEducation = () => withOrder(education);

export const staticSkills = () =>
  skillCategories.flatMap((group) =>
    group.skills.map((skill, index) => ({
      ...skill,
      category: group.category,
      order: index + 1,
    }))
  );

export const staticProfile = () => ({
  name: siteConfig.name,
  title: siteConfig.title,
  bio: siteConfig.description,
  email: siteConfig.email,
  phone: siteConfig.phone,
  location: siteConfig.location,
  linkedinUrl: siteConfig.links.linkedin,
  githubUrl: siteConfig.links.github,
  githubUsername: siteConfig.githubUsername,
  leetcodeUrl: siteConfig.links.leetcode,
  leetcodeUsername: siteConfig.leetcodeUsername,
  resumeUrl: RESUME_PDF_URL,
});
