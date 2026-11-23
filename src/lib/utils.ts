import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * "2026-07-01" -> "Jul 2026". Values that are already display text
 * ("Jul 2026", "Present", "2022") are returned unchanged.
 */
export function formatMonthYear(value?: string | Date | null): string {
  if (!value) return "";
  if (typeof value === "string" && !/^\d{4}-\d{2}/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}
