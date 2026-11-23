"use client";

import Link from "next/link";
import {
  achievements,
  education as fallbackEducation,
  experiences,
  languages,
  siteConfig,
} from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { useRemoteList } from "@/components/shared/use-remote-list";

type Education = (typeof fallbackEducation)[number];

export default function AboutPage() {
  const education = useRemoteList<Education>("/api/education", fallbackEducation);
  const currentRole = experiences.find((exp) => exp.current);

  const facts = [
    currentRole
      ? { label: "Current role", value: `${currentRole.role}, ${currentRole.company}` }
      : null,
    { label: "Location", value: siteConfig.location },
    education[0]
      ? { label: "Degree", value: `${education[0].degree}, ${education[0].institution}` }
      : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <>
      <PageHeader title="About" description={siteConfig.title} />

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground md:text-3xl">
              Summary
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/experience" className="anime-btn">
                Work experience
              </Link>
              <Link href="/resume" className="anime-btn-outline">
                Resume
              </Link>
            </div>
          </div>

          <dl className="anime-card h-fit space-y-4 rounded-xl p-6">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground md:text-3xl">
            Education
          </h2>
          <ol className="relative mt-8 space-y-8 border-l border-border pl-6">
            {education.map((edu) => (
              <li key={`${edu.institution}-${edu.degree}`} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-background bg-primary"
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] text-foreground">
                    {edu.degree}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">{edu.period}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-primary">
                  {edu.institution}
                  {edu.location ? (
                    <span className="text-muted-foreground">, {edu.location}</span>
                  ) : null}
                </p>
                {edu.grade ? (
                  <p className="mt-1 text-sm text-muted-foreground">Grade: {edu.grade}</p>
                ) : null}
                {edu.coursework && edu.coursework.length > 0 ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">Coursework:</span>{" "}
                    {edu.coursework.join(", ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground md:text-3xl">
              Languages
            </h2>
            <ul className="mt-5 space-y-2">
              {languages.map((language) => (
                <li key={language.name} className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{language.name}</span>
                  {" · "}
                  {language.level}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground md:text-3xl">
              Achievements
            </h2>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
