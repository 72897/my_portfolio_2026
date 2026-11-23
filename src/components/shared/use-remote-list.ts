"use client";

import { useEffect, useState } from "react";

/**
 * Starts from the static list and swaps in the API's list once it loads.
 * The static list stays when the request fails or comes back empty, so pages
 * render the same content with or without a database.
 */
export function useRemoteList<T>(url: string, fallback: T[]): T[] {
  const [items, setItems] = useState<T[]>(fallback);

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setItems(data as T[]);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [url]);

  return items;
}
