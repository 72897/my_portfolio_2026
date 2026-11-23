"use client";

import { useEffect, useState } from "react";

export type LiveStats<T> =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "ready"; data: T };

/**
 * Loads stats from one of the site's API routes. A failed request, an error
 * body, or a response flagged `fallback: true` all resolve to "unavailable".
 * Pass a stable `hasData` (module-level function), or the request repeats.
 */
export function useLiveStats<T>(url: string, hasData: (data: T) => boolean): LiveStats<T> {
  const [state, setState] = useState<LiveStats<T>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: (T & { fallback?: boolean; error?: string }) | null) => {
        if (cancelled) return;
        if (!data || data.fallback || data.error || !hasData(data)) {
          setState({ status: "unavailable" });
        } else {
          setState({ status: "ready", data });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "unavailable" });
      });

    return () => {
      cancelled = true;
    };
  }, [url, hasData]);

  return state;
}
