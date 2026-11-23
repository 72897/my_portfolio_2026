"use client";

import { BookOpen, Star } from "lucide-react";
import { Github } from "@/components/shared/brand-icons";
import { LiveStatsUnavailable } from "@/components/shared/live-stats-unavailable";
import { PageHeader } from "@/components/shared/page-header";
import { useLiveStats } from "@/components/shared/use-live-stats";
import { siteConfig } from "@/lib/constants";
import type { GitHubStats } from "@/types";

function hasGitHubData(stats: GitHubStats) {
  return stats.publicRepos > 0 || (stats.topRepos?.length ?? 0) > 0;
}

export default function GitHubPage() {
  const result = useLiveStats<GitHubStats>("/api/github", hasGitHubData);

  return (
    <>
      <PageHeader
        title="GitHub"
        description={`Public repositories and languages for @${siteConfig.githubUsername}, loaded from the GitHub API.`}
      />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {result.status === "loading" ? (
            <p role="status" className="py-16 text-center text-sm text-muted-foreground">
              Loading GitHub stats
            </p>
          ) : result.status === "unavailable" ? (
            <LiveStatsUnavailable service="GitHub" profileUrl={siteConfig.links.github} />
          ) : (
            <GitHubStatsView stats={result.data} />
          )}
        </div>
      </section>
    </>
  );
}

function GitHubStatsView({ stats }: { stats: GitHubStats }) {
  const languages = Object.entries(stats.languages ?? {}).sort((a, b) => b[1] - a[1]);
  const counts = [
    { label: "Public repositories", value: stats.publicRepos },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
  ];

  return (
    <div className="space-y-14">
      <div className="anime-card flex flex-col items-center gap-6 rounded-xl p-6 sm:p-8 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            {stats.name || siteConfig.name}
          </h2>
          <p className="text-sm text-muted-foreground">@{stats.username}</p>
          <dl className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3 md:justify-start">
            {counts.map((count) => (
              <div key={count.label} className="flex flex-col-reverse">
                <dt className="text-xs text-muted-foreground">{count.label}</dt>
                <dd className="text-xl font-bold text-foreground">{count.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="anime-btn inline-flex items-center gap-2"
        >
          <Github className="size-4" aria-hidden="true" />
          Open GitHub profile
        </a>
      </div>

      {languages.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            Languages
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share of recently updated repositories by primary language.
          </p>
          <ul className="anime-card mt-6 space-y-4 rounded-xl p-6">
            {languages.map(([name, share]) => (
              <li key={name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{name}</span>
                  <span className="text-muted-foreground">{share}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${share}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {stats.topRepos?.length ? (
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            Recently updated repositories
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.topRepos.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.url || `${siteConfig.links.github}/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="anime-card group block h-full rounded-xl p-6"
                >
                  <BookOpen className="size-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 font-bold font-[family-name:var(--font-heading)] text-foreground group-hover:text-primary">
                    {repo.name}
                  </h3>
                  {repo.description ? (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {repo.description}
                    </p>
                  ) : null}
                  <p className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    {repo.language && repo.language !== "Unknown" ? <span>{repo.language}</span> : null}
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">Stars:</span>
                      {repo.stars}
                    </span>
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
