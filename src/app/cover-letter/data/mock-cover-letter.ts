import type { CoverLetterDocument } from "../store/cover-letter-store";

const DEFAULT_CONTENT = `
<p><br></p>
<p>Dear Hiring Manager,</p>
<p><br></p>
<p>I am writing to express my interest in the position you have posted. My experience and skills align well with your requirements, and I am excited about the opportunity to contribute to your team.</p>
<p><br></p>
<p>In my previous role, I demonstrated strong capabilities in [relevant skill area] and delivered [quantifiable achievement]. I am confident that I can bring similar results to your organization.</p>
<p><br></p>
<p>I would welcome the opportunity to discuss how my background, skills, and enthusiasms can benefit your company. Thank you for considering my application.</p>
<p><br></p>
<p>Sincerely,</p>
<p>[Your Name]</p>
<p><br></p>
`.trim();

export function createMockCoverLetter(jobId: string, jobTitle: string): CoverLetterDocument {
    const now = new Date().toISOString();
    return {
        id: `cl-${jobId}-${Date.now()}`,
        firestoreId: null,
        jobId,
        title: `Cover Letter - ${jobTitle}`,
        content: DEFAULT_CONTENT,
        createdAt: now,
        updatedAt: now,
    };
}

export const mockJobs = [
    { id: "1", title: "Senior Frontend Developer", company: "Acme Corp", matchScore: 87 },
    { id: "2", title: "Full Stack Engineer", company: "Tech Solutions", matchScore: 92 },
    { id: "3", title: "React Developer", company: "StartupHub", matchScore: 78 },
];
