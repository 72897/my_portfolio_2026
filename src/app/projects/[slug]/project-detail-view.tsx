/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Github } from "@/components/shared/brand-icons";
import type { IProject } from "@/types";

export function ProjectDetailView({ project }: { project: IProject }) {
  const hasLinks = Boolean(project.liveUrl || project.githubUrl);
  const details = [
    { label: "Role", value: project.role },
    { label: "Year", value: project.year },
    { label: "Status", value: project.status },
    { label: "Category", value: project.category },
  ].filter((detail) => Boolean(detail.value));

  return (
    <>
      <section className="py-20 grid-pattern">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Link
            href="/projects"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All projects
          </Link>

          <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)] md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                Live site
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 font-medium hover:bg-muted"
              >
                <Github className="size-4" aria-hidden="true" />
                Source code
              </a>
            ) : null}
            {!hasLinks && project.status === "Internal" ? (
              <span className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground">
                Internal project: no public link or source
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-12">
            {project.longDescription ? (
              <div>
                <h2 className="mb-4 text-2xl font-bold font-[family-name:var(--font-heading)]">
                  Overview
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
                  {project.longDescription}
                </p>
              </div>
            ) : null}

            {project.image ? (
              <img
                src={project.image}
                alt={`Screenshot of ${project.title}`}
                className="block h-auto w-full rounded-xl border border-border"
              />
            ) : null}

            {project.features?.length ? (
              <div>
                <h2 className="mb-4 text-2xl font-bold font-[family-name:var(--font-heading)]">
                  What it does
                </h2>
                <ul className="list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="space-y-8">
            {details.length > 0 ? (
              <dl className="anime-card space-y-4 rounded-xl p-6">
                {details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {detail.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {project.techStack?.length ? (
              <div>
                <h2 className="mb-4 text-lg font-bold font-[family-name:var(--font-heading)]">
                  Stack
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium text-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}
