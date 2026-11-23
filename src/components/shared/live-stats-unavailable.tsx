import { ExternalLink } from "lucide-react";

interface LiveStatsUnavailableProps {
  service: string;
  profileUrl: string;
}

/** Shown when a third-party stats API fails. No numbers are substituted. */
export function LiveStatsUnavailable({ service, profileUrl }: LiveStatsUnavailableProps) {
  return (
    <div className="anime-card mx-auto max-w-xl rounded-2xl p-8 text-center">
      <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
        Couldn&apos;t load live {service} stats
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Live data from {service} is not available right now, so no numbers are
        shown here. The profile itself is up to date.
      </p>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="anime-btn mt-6 inline-flex items-center gap-2"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        Open {service} profile
      </a>
    </div>
  );
}
