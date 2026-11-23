/*
 * Writes the content in src/lib/constants.ts into MongoDB.
 *
 * Profile, projects, certificates, experience, skills, education and the resume
 * summary are replaced, so edits made in the admin panel to those collections
 * are overwritten. Blog posts, job posts and contact messages are left alone.
 *
 * Run with: npm run seed
 */
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import {
  certificates,
  education,
  experiences,
  projects,
  siteConfig,
  skillCategories,
} from "../src/lib/constants";

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const withOrder = <T,>(items: T[]) => items.map((item, index) => ({ ...item, order: index + 1 }));

const listOf = (items: string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items.join("");

async function seed() {
  loadEnvFile();

  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const User = (await import("../src/models/User")).default;
  const Profile = (await import("../src/models/Profile")).default;
  const Project = (await import("../src/models/Project")).default;
  const Certificate = (await import("../src/models/Certificate")).default;
  const Experience = (await import("../src/models/Experience")).default;
  const Skill = (await import("../src/models/Skill")).default;
  const Education = (await import("../src/models/Education")).default;
  const Resume = (await import("../src/models/Resume")).default;

  const admin = await User.findOne({ email: ADMIN_EMAIL });
  if (admin) {
    admin.password = ADMIN_PASSWORD;
    await admin.save();
    console.log("Admin password reset");
  } else {
    await User.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: siteConfig.name,
      role: "admin",
    });
    console.log("Admin user created");
  }

  await Profile.deleteMany({});
  await Profile.create({
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
    resumeUrl: siteConfig.links.resume,
  });
  console.log("Profile seeded");

  await Project.deleteMany({});
  await Project.insertMany(withOrder(projects));
  console.log(`${projects.length} projects seeded`);

  await Certificate.deleteMany({});
  await Certificate.insertMany(withOrder(certificates));
  console.log(`${certificates.length} certificates seeded`);

  await Experience.deleteMany({});
  await Experience.insertMany(withOrder(experiences));
  console.log(`${experiences.length} experience entries seeded`);

  const skills = withOrder(
    skillCategories.flatMap(({ category, skills }) =>
      skills.map((skill) => ({ ...skill, category }))
    )
  );
  await Skill.deleteMany({});
  await Skill.insertMany(skills);
  console.log(`${skills.length} skills seeded`);

  await Education.deleteMany({});
  await Education.insertMany(withOrder(education));
  console.log(`${education.length} education entries seeded`);

  const [currentRole, ...earlierRoles] = experiences;
  await Resume.findOneAndUpdate(
    {},
    {
      summary: siteConfig.description,
      pdfUrl: siteConfig.links.resume,
      highlights: {
        experience: `${currentRole.role} at ${currentRole.company}; internships at ${listOf(
          earlierRoles.map((exp) => exp.company)
        )}`,
        skills: "Python, TypeScript, Next.js, Node.js, REST APIs, n8n, LangChain",
        projects: `${projects.length} projects, including ${listOf(
          projects.slice(0, 3).map((project) => project.title)
        )}`,
        education: `${education[0].degree}, ${education[0].institution}`,
        certifications: `${certificates.length} certifications: ${listOf(
          certificates.map((cert) => cert.organization)
        )}`,
      },
      lastUpdated: new Date(),
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
  console.log("Resume summary seeded");
}

seed()
  .then(() => {
    console.log("Seeding finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
