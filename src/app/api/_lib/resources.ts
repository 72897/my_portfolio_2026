import Certificate from "@/models/Certificate";
import Education from "@/models/Education";
import Experience from "@/models/Experience";
import Project, { PROJECT_CATEGORIES } from "@/models/Project";
import Skill from "@/models/Skill";
import type { ResourceOptions } from "./crud";
import {
  certificateSchema,
  educationSchema,
  experienceSchema,
  projectSchema,
  skillSchema,
} from "./schemas";
import {
  staticCertificates,
  staticEducation,
  staticExperiences,
  staticProjects,
  staticSkills,
} from "./static-data";

export const projectResource: ResourceOptions = {
  label: "Project",
  model: Project,
  schema: projectSchema,
  sort: { order: 1, createdAt: -1 },
  staticItems: staticProjects,
  // Documents seeded before these fields were dropped may still carry them.
  select: "-metrics -challenges -solutions -architectureSteps",
  lookupField: "slug",
  clearable: ["status"],
  filter: (params) => {
    const category = params.get("category");
    const featured = params.get("featured") === "true";
    const knownCategory = (PROJECT_CATEGORIES as readonly string[]).includes(category ?? "")
      ? category
      : null;

    const query: Record<string, unknown> = {};
    if (knownCategory) query.category = knownCategory;
    if (featured) query.featured = true;

    return {
      query,
      matches: (item) => {
        const project = item as { category?: string; featured?: boolean };
        return (
          (!knownCategory || project.category === knownCategory) &&
          (!featured || project.featured === true)
        );
      },
    };
  },
};

export const certificateResource: ResourceOptions = {
  label: "Certificate",
  model: Certificate,
  schema: certificateSchema,
  sort: { order: 1, createdAt: -1 },
  staticItems: staticCertificates,
};

export const experienceResource: ResourceOptions = {
  label: "Experience",
  model: Experience,
  schema: experienceSchema,
  sort: { current: -1, order: 1, createdAt: -1 },
  staticItems: staticExperiences,
};

export const skillResource: ResourceOptions = {
  label: "Skill",
  model: Skill,
  schema: skillSchema,
  sort: { category: 1, order: 1 },
  staticItems: staticSkills,
  // Stored proficiency numbers were never measured; keep them out of responses.
  select: "-proficiency",
};

export const educationResource: ResourceOptions = {
  label: "Education",
  model: Education,
  schema: educationSchema,
  sort: { order: 1, createdAt: -1 },
  staticItems: staticEducation,
};
