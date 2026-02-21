/**
 * Server-side PDF parser wrapper
 * This file should only be imported in API routes (server-side only)
 * to prevent pdf-parse from running during build
 */

import type { Buffer } from "node:buffer";

export interface PdfData {
  text: string;
  numpages: number;
}

/**
 * Parse PDF buffer and extract text
 * This lazy-loads pdf-parse only when actually called at runtime
 */
export async function parsePdfBuffer(buffer: Buffer): Promise<PdfData> {
  // Dynamic import to prevent pdf-parse from loading during build
  const pdfParse = await import("pdf-parse").then((mod) => mod.default);
  return await pdfParse(buffer);
}
