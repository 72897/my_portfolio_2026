"use client";

import { Download, Printer } from "lucide-react";
import {
  achievements,
  certificates,
  education,
  experiences,
  languages,
  projects,
  siteConfig,
  skillCategories,
} from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";

/** Static copy of the resume, served from /public. */
const resumePdfPath = "/resume/Resume_Kunal_Singh.pdf";

const muted = "text-muted-foreground print:text-neutral-700";
const sectionTitle =
  "border-b border-border pb-1.5 text-sm font-bold uppercase tracking-[0.12em] text-primary print:border-neutral-400 print:text-black";

/** Counts the download for the admin dashboard. The link works without it. */
function recordDownload() {
  fetch("/api/resume/download", { method: "POST", keepalive: true }).catch(() => {});
}

const contactItems = [
  { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { label: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s+/g, "")}` },
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "LeetCode", href: siteConfig.links.leetcode },
];

export default function ResumePage() {
  return (
    <>
      <PageHeader
        title="Resume"
        description="Download the PDF, or read and print the same content below."
        className="print:hidden"
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={resumePdfPath}
            download
            onClick={recordDownload}
            className="anime-btn inline-flex items-center gap-2"
          >
            <Download className="size-4" aria-hidden="true" />
            Download PDF
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="anime-btn-outline inline-flex cursor-pointer items-center gap-2"
          >
            <Printer className="size-4" aria-hidden="true" />
            Print this page
          </button>
        </div>
      </PageHeader>

      <section className="py-16 print:py-0">
        <article className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-border bg-card px-5 py-8 text-foreground sm:px-10 sm:py-10 print:max-w-none print:space-y-5 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:text-black">
          <header>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] print:text-2xl">
              {siteConfig.name}
            </h2>
            <p className="mt-1 text-base font-medium text-primary print:text-black">
              {siteConfig.title}
            </p>
            <p className={`mt-2 text-sm ${muted}`}>{siteConfig.location}</p>
            <ul className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm ${muted}`}>
              {contactItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="underline-offset-2 hover:text-primary hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </header>

          <section aria-labelledby="resume-summary">
            <h3 id="resume-summary" className={sectionTitle}>
              Summary
            </h3>
            <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{siteConfig.description}</p>
          </section>

          <section aria-labelledby="resume-experience">
            <h3 id="resume-experience" className={sectionTitle}>
              Experience
            </h3>
            <div className="mt-3 space-y-5">
              {experiences.map((exp) => (
                <div key={`${exp.company}-${exp.role}`} className="print:break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h4 className="text-base font-bold">
                      {exp.role}, {exp.company}
                    </h4>
                    <p className={`text-sm ${muted}`}>
                      {exp.startDate} to {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                  <p className={`text-sm ${muted}`}>
                    {exp.type} · {exp.location}
                  </p>
                  <ul className={`mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed ${muted}`}>
                    {exp.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="resume-projects">
            <h3 id="resume-projects" className={sectionTitle}>
              Projects
            </h3>
            <div className="mt-3 space-y-4">
              {projects.map((project) => (
                <div key={project.slug} className="print:break-inside-avoid">
                  <h4 className="text-base font-bold">
                    {project.title}
                    {project.year ? (
                      <span className={`font-normal ${muted}`}> · {project.year}</span>
                    ) : null}
                  </h4>
                  <p className={`mt-1 text-sm leading-relaxed ${muted}`}>{project.description}</p>
                  <p className={`mt-1 text-sm ${muted}`}>
                    <span className="font-medium text-foreground print:text-black">Stack:</span>{" "}
                    {project.techStack.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="resume-skills">
            <h3 id="resume-skills" className={sectionTitle}>
              Skills
            </h3>
            <dl className="mt-3 space-y-1.5 text-sm">
              {skillCategories.map((group) => (
                <div key={group.category} className="sm:flex sm:gap-2">
                  <dt className="shrink-0 font-semibold">{group.category}:</dt>
                  <dd className={muted}>{group.skills.map((skill) => skill.name).join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="resume-education">
            <h3 id="resume-education" className={sectionTitle}>
              Education
            </h3>
            <div className="mt-3 space-y-3">
              {education.map((edu) => (
                <div key={`${edu.institution}-${edu.degree}`} className="print:break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h4 className="text-base font-bold">{edu.degree}</h4>
                    <p className={`text-sm ${muted}`}>{edu.period}</p>
                  </div>
                  <p className={`text-sm ${muted}`}>
                    {[edu.institution, edu.location, edu.grade].filter(Boolean).join(" · ")}
                  </p>
                  {edu.coursework?.length ? (
                    <p className={`mt-1 text-sm ${muted}`}>
                      Coursework: {edu.coursework.join(", ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="resume-certifications">
            <h3 id="resume-certifications" className={sectionTitle}>
              Certifications
            </h3>
            <ul className={`mt-3 list-disc space-y-1 pl-5 text-sm ${muted}`}>
              {certificates.map((certificate) => (
                <li key={`${certificate.title}-${certificate.organization}`}>
                  {certificate.title}, {certificate.organization}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="resume-other">
            <h3 id="resume-other" className={sectionTitle}>
              Languages and achievements
            </h3>
            <p className={`mt-3 text-sm ${muted}`}>
              {languages.map((language) => `${language.name} (${language.level})`).join(", ")}
            </p>
            <ul className={`mt-2 list-disc space-y-1 pl-5 text-sm ${muted}`}>
              {achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          </section>
        </article>
      </section>
    </>
  );
}
