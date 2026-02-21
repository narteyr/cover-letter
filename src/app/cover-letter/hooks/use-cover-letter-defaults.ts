"use client";

import { useMemo } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useResumeEditorStore } from "../../resume-book/store/resume-editor-store";
import type {
    ContactSection,
    ExperienceSection,
    SkillsSection,
} from "../../resume-book/types/resume-ast";
import type { CoverLetterFormData } from "../components/cover-letter-info-modal";

/**
 * Derives default cover letter form values from available data sources
 * (resume AST → Firebase auth), in priority order.
 *
 * Everything is optional — the user can still edit before generating.
 */
export function useCoverLetterDefaults(): Partial<CoverLetterFormData> {
    const { user } = useAuth();
    const resumeAST = useResumeEditorStore((s) => s.resumeAST);

    return useMemo(() => {
        // ── Resume sections ──────────────────────────────────────────────────
        const contact = resumeAST?.sections?.find(
            (s): s is ContactSection => s.type === "contact"
        );

        const experience = resumeAST?.sections?.find(
            (s): s is ExperienceSection => s.type === "experience"
        );

        const skills = resumeAST?.sections?.find(
            (s): s is SkillsSection => s.type === "skills"
        );

        // ── Candidate name ───────────────────────────────────────────────────
        const candidateName =
            contact?.name ||
            user?.displayName ||
            "";

        // ── Contact details ──────────────────────────────────────────────────
        const candidateEmail =
            contact?.email ||
            user?.email ||
            "";

        const candidatePhone =
            contact?.phone ||
            user?.phoneNumber ||
            "";

        const candidateAddress = contact?.location || "";

        // ── Experience: years & achievements ─────────────────────────────────
        const entries = experience?.entries ?? [];

        // Estimate years of experience from the earliest start date
        const yearsOfExperience = (() => {
            if (!entries.length) return "";
            const dates = entries
                .map((e) => e.startDate)
                .filter(Boolean)
                .map((d) => new Date(d as string).getFullYear())
                .filter((y) => !isNaN(y));
            if (!dates.length) return "";
            const earliest = Math.min(...dates);
            const years = new Date().getFullYear() - earliest;
            return `${years} year${years !== 1 ? "s" : ""} of experience`;
        })();

        // Top achievements — take the most impactful bullets from all entries
        // (prefer bullets with a metrics metadata or high impact score)
        const topAchievements = (() => {
            const allBullets = entries.flatMap((entry) =>
                (entry.bullets ?? []).map((b) => ({
                    text: b.text,
                    impact: b.metadata?.impact ?? 0,
                    company: entry.company,
                    title: entry.title,
                }))
            );

            // Sort by impact desc, fall back to order in resume
            const sorted = [...allBullets].sort((a, b) => b.impact - a.impact);
            // Take top 3
            const top = sorted.slice(0, 3);
            if (!top.length) return "";
            return top.map((b) => `• ${b.text}`).join("\n");
        })();

        // ── Skills ────────────────────────────────────────────────────────────
        const relevantSkills = (() => {
            if (!skills) return "";
            // Combine flat skills + all category skills
            const flat = skills.skills ?? [];
            const categorised = (skills.categories ?? []).flatMap((c) => c.skills);
            const all = [...new Set([...flat, ...categorised])];
            return all.join(", ");
        })();

        return {
            candidateName,
            candidateEmail,
            candidatePhone,
            candidateAddress,
            yearsOfExperience,
            topAchievements,
            relevantSkills,
        };
    }, [resumeAST, user]);
}
