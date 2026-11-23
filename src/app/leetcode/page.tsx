"use client";

import { ExternalLink } from "lucide-react";
import { LiveStatsUnavailable } from "@/components/shared/live-stats-unavailable";
import { PageHeader } from "@/components/shared/page-header";
import { useLiveStats } from "@/components/shared/use-live-stats";
import { siteConfig } from "@/lib/constants";
import type { LeetCodeStats } from "@/types";

function hasLeetCodeData(stats: LeetCodeStats) {
  return stats.totalSolved > 0;
}

export default function LeetCodePage() {
  const result = useLiveStats<LeetCodeStats>("/api/leetcode", hasLeetCodeData);

  return (
    <>
      <PageHeader
        title="LeetCode"
        description={`Problems solved by @${siteConfig.leetcodeUsername}, loaded from LeetCode.`}
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {result.status === "loading" ? (
            <p role="status" className="py-16 text-center text-sm text-muted-foreground">
              Loading LeetCode stats
            </p>
          ) : result.status === "unavailable" ? (
            <LiveStatsUnavailable service="LeetCode" profileUrl={siteConfig.links.leetcode} />
          ) : (
            <LeetCodeStatsView stats={result.data} />
          )}
        </div>
      </section>
    </>
  );
}

function LeetCodeStatsView({ stats }: { stats: LeetCodeStats }) {
  const difficulties = [
    { label: "Easy", solved: stats.easySolved, color: "#10b981" },
    { label: "Medium", solved: stats.mediumSolved, color: "#3b82f6" },
    { label: "Hard", solved: stats.hardSolved, color: "#ef4444" },
  ];

  return (
    <div className="space-y-10">
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="anime-card flex flex-col-reverse rounded-2xl p-6 text-center">
          <dt className="mt-1 text-sm text-muted-foreground">Problems solved</dt>
          <dd className="text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            {stats.totalSolved}
          </dd>
        </div>
        {stats.ranking > 0 ? (
          <div className="anime-card flex flex-col-reverse rounded-2xl p-6 text-center">
            <dt className="mt-1 text-sm text-muted-foreground">Global ranking</dt>
            <dd className="text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground">
              {stats.ranking.toLocaleString("en-US")}
            </dd>
          </div>
        ) : null}
      </dl>

      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground">
          By difficulty
        </h2>
        <ul className="anime-card mt-6 space-y-6 rounded-2xl p-6">
          {difficulties.map((difficulty) => {
            const share = Math.round((difficulty.solved / stats.totalSolved) * 100);
            return (
              <li key={difficulty.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{difficulty.label}</span>
                  <span className="text-muted-foreground">
                    {difficulty.solved} solved ({share}% of total)
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${share}%`, backgroundColor: difficulty.color }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="text-center">
        <a
          href={siteConfig.links.leetcode}
          target="_blank"
          rel="noopener noreferrer"
          className="anime-btn inline-flex items-center gap-2"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Open LeetCode profile
        </a>
      </div>
    </div>
  );
}
