'use client';

import { useCallback, useEffect, useState } from 'react';

interface ApiErrorBody {
  error?: string;
  details?: { field?: string; message?: string }[];
}

function describeError(body: ApiErrorBody | null, status: number): string {
  if (status === 401) return 'Your session has expired. Sign in again.';
  const details = Array.isArray(body?.details)
    ? body.details
        .slice(0, 4)
        .map((detail) => [detail.field, detail.message].filter(Boolean).join(': '))
        .join('; ')
    : '';
  const message = body?.error || `Request failed (${status})`;
  return details ? `${message}: ${details}` : message;
}

/** fetch wrapper that returns the parsed body or throws an Error with the server's message. */
export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: init?.body ? { 'Content-Type': 'application/json', ...init.headers } : init?.headers,
    });
  } catch {
    throw new Error('Could not reach the server.');
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(describeError(body, res.status));
  return body as T;
}

/**
 * Loads a list for an admin page. `?source=db` asks the API for database rows
 * only, so a database outage shows as an error instead of static site data.
 */
export function useAdminList<T>(endpoint: string, enabled: boolean) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await apiRequest<T[]>(`${endpoint}?source=db`);
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (!enabled) return;
    // Deferred so the state updates happen after the effect, not inside it.
    const timer = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timer);
  }, [enabled, reload]);

  return { items, setItems, loading, error, reload };
}

export const errorMessage = (err: unknown, fallback = 'Something went wrong') =>
  err instanceof Error ? err.message : fallback;
