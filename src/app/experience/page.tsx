"use client";

import { experiences as fallbackExperiences } from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { useRemoteList } from "@/components/shared/use-remote-list";
import { cn } from "@/lib/utils";
import type { IExperience } from "@/types";

/** Accepts "Jul 2026" from the static data and ISO dates from the API. */
function formatMonth(value: string | undefined) {
  if (!value) return "";
  if (!/^\d{4}-\d{2}/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export default function ExperiencePage() {
  const experiences = useRemoteList<IExperience>("/api/experience", fallbackExperiences);

  return (
    <>
      <PageHeader
        title="Experience"
        description="Where I have worked and what I built there, most recent first."
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <ol className="relative space-y-12 border-l border-border pl-6 sm:pl-8">
            {experiences.map((exp) => {
              const start = formatMonth(exp.startDate);
              const end = exp.current ? "Present" : formatMonth(exp.endDate);

              return (
                <li key={exp._id || `${exp.company}-${exp.role}`} className="relative">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1.5 size-3 rounded-full border-2 border-background -left-[31px] sm:-left-[39px]",
                      exp.current ? "bg-primary ring-4 ring-primary/25" : "bg-muted-foreground"
                    )}
                  />

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                      {exp.role}
                    </h2>
                    {exp.current ? (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        Current
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-sm font-medium text-primary">{exp.company}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[
                      [start, end].filter(Boolean).join(" to "),
                      exp.type,
                      exp.location,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  {exp.bullets?.length ? (
                    <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                      {exp.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}

                  {exp.technologies?.length ? (
                    <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
