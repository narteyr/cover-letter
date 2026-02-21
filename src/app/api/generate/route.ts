/**
 * API route for cover letter generation
 * Uses Llama API (server-side LLAMA_API_KEY from .env)
 * Uses fetch directly to handle both Llama (completion_message) and OpenAI (choices) response formats.
 */

import { NextRequest, NextResponse } from "next/server";

export interface CoverLetterRequest {
  // Company & role
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  jobDescription: string;
  companyValues?: string;
  // Hiring manager
  hiringManagerName?: string;
  hiringManagerTitle?: string;
  // Candidate contact (from parsed resume)
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateAddress?: string;
  // Candidate background (from parsed resume)
  yearsOfExperience?: string;
  topAchievements: string;
  relevantSkills: string;
  // Motivation
  whyThisCompany?: string;
  whyThisRole?: string;
  additionalContext?: string;
}

/** Get base URL for OpenAI-compatible Llama API */
function getLlamaBaseUrl(): string {
  const url = process.env.LLAMA_API_URL || "https://api.llama.com/v1/chat/completions";
  return url.replace(/\/chat\/completions\/?$/, "") || "https://api.llama.com/v1";
}

export interface CoverLetterResponse {
  html: string;
  error?: string;
}

/**
 * Format date as "19 February 2026"
 */
function formatLetterDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Build the cover letter prompt (same as main app)
 */
function buildCoverLetterPrompt(req: CoverLetterRequest): string {
  const today = formatLetterDate();

  // Sender block
  const senderLines = [
    req.candidateName,
    req.candidateAddress || null,
    req.candidateEmail || null,
    req.candidatePhone || null,
  ].filter(Boolean);

  // Recipient block
  const recipientLines = [
    req.hiringManagerName || null,
    req.hiringManagerTitle || null,
    req.companyName,
    req.companyAddress || null,
  ].filter(Boolean);

  // Salutation
  const salutation = req.hiringManagerName
    ? `Dear ${req.hiringManagerName},`
    : "Dear Hiring Manager,";

  // Valediction
  const valediction = req.hiringManagerName ? "Yours sincerely," : "Yours faithfully,";

  // Background data
  const bodyData = [
    `CANDIDATE: ${req.candidateName}`,
    req.yearsOfExperience ? `EXPERIENCE: ${req.yearsOfExperience}` : null,
    `TARGET ROLE: ${req.jobTitle} at ${req.companyName}`,
    `JOB DESCRIPTION:\n${req.jobDescription}`,
    req.companyValues ? `COMPANY NOTES (values/culture/product):\n${req.companyValues}` : null,
    `KEY ACHIEVEMENTS — use these verbatim or very closely paraphrased. These are the heart of the letter:\n${req.topAchievements}`,
    `RELEVANT SKILLS: ${req.relevantSkills}`,
    req.whyThisCompany ? `WHY THIS COMPANY (candidate's own words — preserve voice and specificity):\n${req.whyThisCompany}` : null,
    req.whyThisRole ? `WHY THIS ROLE (candidate's own words):\n${req.whyThisRole}` : null,
    req.additionalContext ? `ADDITIONAL CONTEXT:\n${req.additionalContext}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  return `You are a world-class professional cover letter writer. You write with clarity, confidence, and specificity. Your letters follow the standard business letter format and sound like a sharp, thoughtful human — not an AI.

TASK: Write a complete, properly structured cover letter using the candidate data below.

════════════════════════════════════════
LETTER STRUCTURE — output EVERY section in this exact order:
════════════════════════════════════════

1. SENDER BLOCK (candidate's details, right-aligned in print but output as HTML)
   Use this exact data (one item per <p> tag, wrapped in a <div class="sender-block">):
   ${senderLines.map((l) => `   ${l}`).join("\n")}

2. DATE
   Output as a single <p class="letter-date"> tag containing: ${today}

3. RECIPIENT BLOCK (company/hiring manager, left-aligned)
   Use this exact data (one item per <p> tag, wrapped in a <div class="recipient-block">):
   ${recipientLines.map((l) => `   ${l}`).join("\n")}

4. SUBJECT LINE
   Format: <p class="letter-subject"><strong>Re: Application for ${req.jobTitle}</strong></p>

5. SALUTATION
   Use exactly: <p class="letter-salutation">${salutation}</p>

6. BODY (3–4 paragraphs, each a <p class="letter-body"> tag)
   HARD RULES for the body — violating any means failure:
   a) NEVER use these banned phrases: "I am excited to apply", "I am writing to express my interest", "I am passionate about", "dynamic", "synergy", "leverage", "impactful", "world-class", "I would be a great fit", "thrilled", "delighted", "I am confident that", "look no further", "results-driven", "team player", "fast-paced environment".
   b) Open with a direct, specific sentence that immediately signals relevance — a concrete result, a shared problem, or a specific observation about the company. NOT "I saw your job posting".
   c) Ground every claim in the candidate's actual achievements. No vague promises.
   d) Reference specific company details from the notes to show genuine knowledge. If no notes are given, stay general — do NOT invent specifics.
   e) First person, active voice. Past tense for achievements, present/future for intentions.
   f) Prose only — no bullet points, no lists.
   g) End with a confident, direct closing sentence — NOT "I look forward to hearing from you". Something brief and self-assured, like "I would welcome the chance to discuss this further at your convenience." or similar professional close.

7. VALEDICTION
   Use exactly: <p class="letter-valediction">${valediction}</p>

8. SIGNATURE
   Format: <p class="letter-signature">${req.candidateName}</p>

════════════════════════════════════════
CANDIDATE DATA (for the body):
════════════════════════════════════════
${bodyData}

════════════════════════════════════════
OUTPUT FORMAT:
════════════════════════════════════════
Return ONLY valid HTML — no <html>/<body>/<head> tags, no markdown, no code fences, no preamble.
Output all 8 sections in order. Use the CSS classes specified above.

Write the complete letter now:`;
}

/**
 * POST /api/generate
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey: _clientKey, ...coverLetterBody } = body;
    const requestBody: CoverLetterRequest = coverLetterBody;

    // Use server-side Llama API key
    const apiKey = process.env.LLAMA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "LLAMA_API_KEY is not configured. Add it to your .env file." },
        { status: 500 }
      );
    }

    // Validate required fields
    const missing: string[] = [];
    if (!requestBody.companyName?.trim()) missing.push("companyName");
    if (!requestBody.jobTitle?.trim()) missing.push("jobTitle");
    if (!requestBody.jobDescription?.trim()) missing.push("jobDescription");
    if (!requestBody.candidateName?.trim()) missing.push("candidateName");
    if (!requestBody.topAchievements?.trim()) missing.push("topAchievements");
    if (!requestBody.relevantSkills?.trim()) missing.push("relevantSkills");
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Build prompt
    const prompt = buildCoverLetterPrompt(requestBody);

    const apiUrl = `${getLlamaBaseUrl()}/chat/completions`;
    const model = process.env.LLAMA_MODEL || "Llama-4-Maverick-17B-128E-Instruct-FP8";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a world-class professional cover letter writer. Return only the HTML cover letter body — no markdown, no preamble.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      const err: Error & { status?: number } = new Error(`Llama API ${response.status}: ${errText}`);
      err.status = response.status;
      throw err;
    }

    const data = (await response.json()) as {
      completion_message?: { content?: { text?: string } };
      choices?: Array<{ message?: { content?: string } }>;
    };

    // Llama API may return completion_message.content.text or choices[0].message.content
    const html =
      data.completion_message?.content?.text ??
      data.choices?.[0]?.message?.content ??
      "";

    if (!html) {
      throw new Error("No content generated");
    }

    return NextResponse.json({ html });
  } catch (error: any) {
    console.error("[Cover Letter API] Error:", error);

    // Handle rate limit errors
    if (error?.status === 429 || error?.message?.includes("rate limit")) {
      return NextResponse.json(
        {
          error: "Llama API rate limit exceeded. Please try again in a moment.",
          isRateLimitError: true,
        },
        { status: 429 }
      );
    }

    // Handle invalid API key
    if (error?.status === 401 || error?.message?.includes("Incorrect API key")) {
      return NextResponse.json(
        { error: "Invalid Llama API key. Check LLAMA_API_KEY in .env" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
