import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx
 */
export const cx = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Helper for sorting classes in style objects (no-op, for Tailwind IntelliSense)
 */
export function sortCx<T extends Record<string, string | number | Record<string, string | number | Record<string, string | number>>>>(
  classes: T
): T {
  return classes;
}
