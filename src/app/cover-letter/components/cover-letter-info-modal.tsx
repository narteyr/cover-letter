"use client";

import { useState, useEffect } from "react";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Label } from "@/components/base/input/label";
import { TextAreaBase } from "@/components/base/textarea/textarea";
import { MagicWand01, File05, ChevronDown, Upload01, CheckCircle } from "@untitledui/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CoverLetterFormData {
    // Required — user fills these
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    // Optional context — user can add but not required
    extraContext: string;
    // Background — auto-filled from resume/profile, not shown in the modal
    companyAddress: string;
    companyValues: string;
    hiringManagerName: string;
    hiringManagerTitle: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone: string;
    candidateAddress: string;
    yearsOfExperience: string;
    topAchievements: string;
    relevantSkills: string;
    // Kept for API compat; derived from extraContext
    whyThisCompany: string;
    whyThisRole: string;
    additionalContext: string;
}

export const EMPTY_FORM: CoverLetterFormData = {
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    extraContext: "",
    companyAddress: "",
    companyValues: "",
    hiringManagerName: "",
    hiringManagerTitle: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    candidateAddress: "",
    yearsOfExperience: "",
    topAchievements: "",
    relevantSkills: "",
    whyThisCompany: "",
    whyThisRole: "",
    additionalContext: "",
};

// ─── Static background fallbacks (used when backend / resume is unavailable) ──

const STATIC_BACKGROUND: Partial<CoverLetterFormData> = {
    candidateName: "Applicant",
    yearsOfExperience: "3 years of experience in software development",
    topAchievements:
        "• Delivered full-stack features used by thousands of daily active users\n" +
        "• Improved page load performance by 40% through code-splitting and caching\n" +
        "• Collaborated cross-functionally to ship a redesigned onboarding flow, reducing drop-off by 25%",
    relevantSkills:
        "TypeScript, React, Next.js, Node.js, PostgreSQL, REST APIs, Git, Agile/Scrum",
};

// ─── Shared input style ───────────────────────────────────────────────────────

const INPUT_CLS =
    "w-full rounded-lg bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs ring-1 ring-primary ring-inset placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-brand transition duration-100";

// ─── Field wrapper ────────────────────────────────────────────────────────────

interface FieldProps {
    label: string;
    hint?: string;
    required?: boolean;
    children: React.ReactNode;
}

function Field({ label, hint, required, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label>
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
            </Label>
            {children}
            {hint && <p className="text-xs text-tertiary">{hint}</p>}
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface CoverLetterInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: CoverLetterFormData) => void;
    isGenerating: boolean;
    /** Pre-filled values derived from resume / profile data */
    initialValues?: Partial<CoverLetterFormData>;
}

export function CoverLetterInfoModal({
    isOpen,
    onClose,
    onGenerate,
    isGenerating,
    initialValues,
}: CoverLetterInfoModalProps) {
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [extraContext, setExtraContext] = useState("");
    const [showExtra, setShowExtra] = useState(false);

    // Resume upload state
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isParsingResume, setIsParsingResume] = useState(false);
    const [resumeParseError, setResumeParseError] = useState("");
    const [parsedResumeData, setParsedResumeData] = useState<Partial<CoverLetterFormData> | null>(null);

    // Re-seed visible fields when modal opens
    useEffect(() => {
        if (isOpen) {
            setCompanyName(initialValues?.companyName ?? "");
            setJobTitle(initialValues?.jobTitle ?? "");
            setJobDescription(initialValues?.jobDescription ?? "");
            setExtraContext(initialValues?.extraContext ?? "");
            setShowExtra(false);
            // Reset resume upload state
            setResumeFile(null);
            setIsParsingResume(false);
            setResumeParseError("");
            setParsedResumeData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Handle resume file upload
    async function handleResumeUpload(file: File) {
        setResumeFile(file);
        setIsParsingResume(true);
        setResumeParseError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/parse-resume", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to parse resume");
            }

            const parsed = await response.json();

            // Map the API response to our form data structure
            const resumeData: Partial<CoverLetterFormData> = {
                candidateName: parsed.candidateName,
                candidateEmail: parsed.candidateEmail,
                candidatePhone: parsed.candidatePhone,
                candidateAddress: parsed.candidateAddress,
                yearsOfExperience: parsed.yearsOfExperience,
                topAchievements: parsed.topAchievements,
                relevantSkills: parsed.relevantSkills,
            };

            setParsedResumeData(resumeData);
        } catch (error: any) {
            console.error("Resume parse error:", error);
            setResumeParseError(error.message || "Failed to parse resume");
            setResumeFile(null);
        } finally {
            setIsParsingResume(false);
        }
    }

    const canSubmit = companyName.trim() && jobTitle.trim() && jobDescription.trim();

    function handleSubmit() {
        if (!canSubmit) return;

        // Merge: parsed resume data > initialValues > static fallbacks
        // Priority: parsedResumeData (from uploaded resume) > initialValues (from profile) > STATIC_BACKGROUND
        const background: Partial<CoverLetterFormData> = { ...STATIC_BACKGROUND };

        // First apply initialValues
        for (const [k, v] of Object.entries(initialValues ?? {})) {
            if (v != null && String(v).trim() !== "") {
                (background as Record<string, unknown>)[k] = v;
            }
        }

        // Then apply parsedResumeData (higher priority)
        for (const [k, v] of Object.entries(parsedResumeData ?? {})) {
            if (v != null && String(v).trim() !== "") {
                (background as Record<string, unknown>)[k] = v;
            }
        }

        const formData: CoverLetterFormData = {
            // User-provided
            companyName: companyName.trim(),
            jobTitle: jobTitle.trim(),
            jobDescription: jobDescription.trim(),
            extraContext: extraContext.trim(),
            // Background (auto-filled, not visible)
            companyAddress: background.companyAddress ?? "",
            companyValues: background.companyValues ?? "",
            hiringManagerName: background.hiringManagerName ?? "",
            hiringManagerTitle: background.hiringManagerTitle ?? "",
            candidateName: background.candidateName ?? "",
            candidateEmail: background.candidateEmail ?? "",
            candidatePhone: background.candidatePhone ?? "",
            candidateAddress: background.candidateAddress ?? "",
            yearsOfExperience: background.yearsOfExperience ?? STATIC_BACKGROUND.yearsOfExperience ?? "",
            topAchievements: background.topAchievements ?? STATIC_BACKGROUND.topAchievements ?? "",
            relevantSkills: background.relevantSkills ?? STATIC_BACKGROUND.relevantSkills ?? "",
            // Map extraContext into the motivation fields the API expects
            whyThisCompany: extraContext.trim(),
            whyThisRole: "",
            additionalContext: "",
        };

        onGenerate(formData);
    }

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
            <ModalOverlay>
                <Modal className="max-w-lg">
                    <Dialog>
                        <div className="flex flex-col w-full bg-primary rounded-2xl border border-secondary shadow-xl overflow-hidden">

                            {/* ── Header ── */}
                            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-secondary">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-10 rounded-xl bg-brand-50 shrink-0">
                                        <File05 className="size-5 text-fg-brand-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-primary">
                                            Create Cover Letter
                                        </h2>
                                        <p className="text-sm text-tertiary">
                                            Paste the job details — we'll handle the rest.
                                        </p>
                                    </div>
                                </div>
                                <CloseButton size="sm" onClick={onClose} aria-label="Close" />
                            </div>

                            {/* ── Body ── */}
                            <div className="flex flex-col gap-5 px-6 pt-5 pb-2 overflow-y-auto max-h-[68vh]">

                                {/* Resume Upload Section */}
                                <div className="flex flex-col gap-3">
                                    <Label>Upload your resume (optional)</Label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleResumeUpload(file);
                                            }}
                                            className="hidden"
                                            id="resume-upload"
                                            disabled={isParsingResume}
                                        />
                                        <label
                                            htmlFor="resume-upload"
                                            className={`flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-colors ${
                                                resumeFile
                                                    ? "border-utility-success-300 bg-utility-success-50"
                                                    : "border-secondary bg-subtle hover:border-primary hover:bg-primary"
                                            } ${isParsingResume ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {isParsingResume ? (
                                                <>
                                                    <div className="size-5 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
                                                    <span className="text-sm text-secondary">Parsing resume...</span>
                                                </>
                                            ) : resumeFile ? (
                                                <>
                                                    <CheckCircle className="size-5 text-utility-success-600" />
                                                    <span className="text-sm font-medium text-utility-success-700">
                                                        {resumeFile.name}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload01 className="size-5 text-tertiary" />
                                                    <span className="text-sm text-secondary">
                                                        Click to upload PDF or Word document
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {resumeParseError && (
                                        <p className="text-sm text-error">{resumeParseError}</p>
                                    )}
                                    {parsedResumeData && (
                                        <div className="rounded-lg bg-utility-success-50 border border-utility-success-200 p-3">
                                            <p className="text-xs text-utility-success-700 font-medium">
                                                ✓ Resume parsed successfully! Your background info will be used in the cover letter.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Company + Role — side by side */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Company name" required>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="e.g. Stripe"
                                            className={INPUT_CLS}
                                            autoFocus
                                        />
                                    </Field>
                                    <Field label="Job title" required>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            placeholder="e.g. Senior Engineer"
                                            className={INPUT_CLS}
                                        />
                                    </Field>
                                </div>

                                {/* Job description — the most important field */}
                                <Field
                                    label="Job description / key requirements"
                                    hint="Paste the full posting or just the bullet points. The more detail here, the more tailored your letter."
                                    required
                                >
                                    <TextAreaBase
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the job description or key requirements here…"
                                        rows={6}
                                    />
                                </Field>

                                {/* Optional extras — collapsed by default */}
                                <div className="flex flex-col gap-3">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1.5 text-sm text-tertiary hover:text-primary transition-colors w-fit"
                                        onClick={() => setShowExtra((v) => !v)}
                                    >
                                        <ChevronDown
                                            className={`size-4 transition-transform duration-200 ${showExtra ? "rotate-180" : ""}`}
                                        />
                                        {showExtra ? "Hide" : "Add"} extra context
                                        <span className="text-quaternary">(optional)</span>
                                    </button>

                                    {showExtra && (
                                        <Field
                                            label="Anything specific to highlight?"
                                            hint="Why you want this role, a mutual connection, a project you admire, your notice period — anything relevant."
                                        >
                                            <TextAreaBase
                                                value={extraContext}
                                                onChange={(e) => setExtraContext(e.target.value)}
                                                placeholder={`e.g. I've used Stripe's API for 3 years. The docs quality has directly shaped how I think about DX. Happy to relocate.`}
                                                rows={3}
                                            />
                                        </Field>
                                    )}
                                </div>

                                {/* Ready callout */}
                                {canSubmit && (
                                    <div className="rounded-xl bg-brand-50 border border-brand-200 p-4 flex items-start gap-2.5">
                                        <MagicWand01 className="size-4 text-fg-brand-primary shrink-0 mt-0.5" />
                                        <p className="text-xs text-secondary leading-relaxed">
                                            We'll write a full business letter for{" "}
                                            <strong>{companyName}</strong> — salutation, tailored body,
                                            valediction, and your contact details. No AI filler.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ── Footer ── */}
                            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-secondary bg-primary shrink-0">
                                <Button
                                    size="md"
                                    color="secondary"
                                    onClick={onClose}
                                    isDisabled={isGenerating}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    size="md"
                                    color="primary"
                                    onClick={handleSubmit}
                                    isDisabled={!canSubmit || isGenerating}
                                    iconLeading={isGenerating ? undefined : MagicWand01}
                                >
                                    {isGenerating ? "Generating…" : "Generate Cover Letter"}
                                </Button>
                            </div>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
}
