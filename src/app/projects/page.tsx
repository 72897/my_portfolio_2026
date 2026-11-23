"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { Github } from "@/components/shared/brand-icons";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectPreviewVisual } from "@/components/shared/project-preview-visual";
import { useRemoteList } from "@/components/shared/use-remote-list";
import { projects as fallbackProjects } from "@/lib/constants";
import type { IProject } from "@/types";

export default function ProjectsPage() {
  const projects = useRemoteList<IProject>("/api/projects", fallbackProjects);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = activeCategory === "All" || project.category === activeCategory;
      const matchesSearch =
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, search]);

  return (
    <>
      <PageHeader
        title="Projects"
        description="Work projects and personal builds. Each page lists what the project does and what it is built with."
      />

      <section className="py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <label htmlFor="project-search" className="sr-only">
              Search projects
            </label>
            <input
              id="project-search"
              type="search"
              autoComplete="off"
              placeholder="Search projects"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="anime-input w-full py-1.5 pl-10 pr-4 text-xs"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              No projects match that search.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-7 md:grid-cols-2">
              {filtered.map((project) => {
                const hasLinks = Boolean(project.liveUrl || project.githubUrl);
                const meta = [project.category, project.year].filter(Boolean).join(" · ");

                return (
                  <li key={project.slug}>
                    <article className="anime-card flex h-full flex-col rounded-2xl p-4">
                      <ProjectPreviewVisual image={project.image} title={project.title} className="mb-4" />

                      <div className="flex flex-1 flex-col px-1 sm:px-2">
                        <p className="text-xs font-medium text-muted-foreground">{meta}</p>
                        <h2 className="mt-1 text-xl font-bold font-[family-name:var(--font-heading)] text-foreground sm:text-2xl">
                          <Link href={`/projects/${project.slug}`} className="hover:text-primary">
                            {project.title}
                          </Link>
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>

                        <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <li
                              key={tech}
                              className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-sm font-semibold text-primary hover:underline"
                            aria-label={`Details for ${project.title}`}
                          >
                            Details
                          </Link>
                          <div className="flex items-center gap-2">
                            {project.liveUrl ? (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                              >
                                <ExternalLink className="size-3.5" aria-hidden="true" />
                                Live site
                              </a>
                            ) : null}
                            {project.githubUrl ? (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                              >
                                <Github className="size-3.5" aria-hidden="true" />
                                Code
                              </a>
                            ) : null}
                            {!hasLinks && project.status === "Internal" ? (
                              <span className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                Internal project
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
