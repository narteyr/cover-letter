/**
 * Server-side PDF parser wrapper using LangChain PDFLoader
 * This file should only be imported in API routes (server-side only)
 */

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import type { Buffer } from "node:buffer";

export interface PdfData {
  text: string;
  numpages: number;
}

/**
 * Parse PDF buffer and extract text using LangChain PDFLoader
 */
export async function parsePdfBuffer(buffer: Buffer): Promise<PdfData> {
  // Convert Buffer to Blob for PDFLoader
  // Use buffer's underlying ArrayBuffer and ensure it's an ArrayBuffer (not SharedArrayBuffer)
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });

  // PDFLoader can work with Blob objects
  const loader = new PDFLoader(blob);
  const docs = await loader.load();

  // Combine all document pages into a single text string
  const text = docs.map((doc) => doc.pageContent).join("\n\n");

  return {
    text,
    numpages: docs.length,
  };
}
