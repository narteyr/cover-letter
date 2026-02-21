/**
 * API route for resume parsing
 * Extracts structured data from PDF/DOCX files using LangChain + Llama API
 */

import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import * as mammoth from "mammoth";
import { parsePdfBuffer } from "@/lib/pdf-parser";

/** Get base URL for OpenAI-compatible API (without /chat/completions path) */
function getLlamaBaseUrl(): string {
  const url = process.env.LLAMA_API_URL || "https://api.llama.com/v1/chat/completions";
  return url.replace(/\/chat\/completions\/?$/, "") || "https://api.llama.com/v1";
}

// Define the expected resume structure
const ResumeSchema = z.object({
  candidateName: z.string().describe("Full name of the candidate"),
  candidateEmail: z.string().email().optional().describe("Email address"),
  candidatePhone: z.string().optional().describe("Phone number"),
  candidateAddress: z.string().optional().describe("Full address or city/state"),
  yearsOfExperience: z.string().optional().describe("Total years of professional experience (e.g., '5 years')"),
  topAchievements: z.string().describe("3-5 key achievements with metrics and impact"),
  relevantSkills: z.string().describe("Comma-separated list of relevant technical and soft skills"),
  currentTitle: z.string().optional().describe("Current or most recent job title"),
  education: z.string().optional().describe("Highest degree and institution"),
});

type ParsedResume = z.infer<typeof ResumeSchema>;

/**
 * Extract text from uploaded file buffer
 */
async function extractTextFromBuffer(buffer: Buffer, fileType: string): Promise<string> {
  if (fileType === "application/pdf") {
    // Use server-side wrapper to prevent pdf-parse test code from running
    const data = await parsePdfBuffer(buffer);
    return data.text;
  } else if (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    throw new Error("Unsupported file type");
  }
}

/**
 * Parse resume text with AI (uses Llama API from env)
 */
async function parseResumeWithAI(resumeText: string): Promise<ParsedResume> {
  const apiKey = process.env.LLAMA_API_KEY;
  if (!apiKey) {
    throw new Error("LLAMA_API_KEY is not configured. Add it to your .env file.");
  }

  const model = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: process.env.LLAMA_MODEL || "Llama-4-Maverick-17B-128E-Instruct-FP8",
    configuration: {
      baseURL: getLlamaBaseUrl(),
    },
    temperature: 0,
  });

  const parser = StructuredOutputParser.fromZodSchema(ResumeSchema);

  const promptTemplate = PromptTemplate.fromTemplate(
    `You are an expert resume parser. Extract the following information from the resume text below.
Be precise and extract actual text from the resume - do not make up information.

{format_instructions}

Resume Text:
{resume_text}

Parse the resume and return the extracted information in the specified format.`
  );

  const input = await promptTemplate.format({
    format_instructions: parser.getFormatInstructions(),
    resume_text: resumeText,
  });

  const response = await model.invoke(input);

  // Debug: log response structure to understand what's being returned
  if (!response || typeof response.content === 'undefined') {
    console.error('[Parse Resume] Unexpected response structure:', JSON.stringify(response, null, 2));
    throw new Error('Invalid response from AI model - no content returned');
  }

  const parsed = await parser.parse(response.content as string);

  return parsed;
}

/**
 * POST /api/parse-resume
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from file
    const resumeText = await extractTextFromBuffer(buffer, file.type);

    if (!resumeText || resumeText.trim().length < 100) {
      return NextResponse.json(
        { error: "Could not extract enough text from the resume" },
        { status: 400 }
      );
    }

    // Parse with AI (uses LLAMA_API_KEY from server env)
    const parsed = await parseResumeWithAI(resumeText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("[Parse Resume API] Error:", error);

    // Handle invalid API key
    if (error?.status === 401 || error?.message?.includes("Incorrect API key")) {
      return NextResponse.json(
        { error: "Invalid Llama API key. Check LLAMA_API_KEY in .env" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to parse resume" },
      { status: 500 }
    );
  }
}
