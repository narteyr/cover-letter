/**
 * Client-side resume parsing
 * Calls the server-side API to parse resumes
 */

export interface ParsedResume {
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateAddress?: string;
  yearsOfExperience?: string;
  topAchievements: string;
  relevantSkills: string;
  currentTitle?: string;
  education?: string;
}

/**
 * Process an uploaded resume file by calling the API.
 * Uses server-side LLAMA_API_KEY - no client API key needed.
 */
export async function processResumeFile(file: File): Promise<ParsedResume> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/parse-resume", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to parse resume");
  }

  const parsed: ParsedResume = await response.json();
  return parsed;
}
