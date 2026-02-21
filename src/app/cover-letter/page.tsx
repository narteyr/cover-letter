"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EditorHeader from "../resume-book/components/editor-header";
import { CoverLetterEditor } from "./components/cover-letter-editor";
import { CoverLetterWritingTips } from "./components/cover-letter-writing-tips";
import { CoverLetterMetrics } from "./components/cover-letter-metrics";
import { CoverLetterInfoModal } from "./components/cover-letter-info-modal";
import { useCoverLetterStore } from "./store/cover-letter-store";
import { useCoverLetterDefaults } from "./hooks/use-cover-letter-defaults";
import { mockJobs } from "./data/mock-cover-letter";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Button } from "@/components/base/buttons/button";
import { Save01, Download01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { useAuth } from "@/providers/auth-provider";
import { downloadCoverLetterPdf } from "./utils/download-pdf";
import type { CoverLetterFormData } from "./components/cover-letter-info-modal";

const CoverLetterPageContent = () => {
    const [selectedJobId, setSelectedJobId] = useState<string>("1");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<"preview" | "edit">("preview");
    const paperRef = useRef<HTMLDivElement>(null);

    const searchParams = useSearchParams();
    const { user } = useAuth();

    const document = useCoverLetterStore((s) => s.document);
    const showInfoModal = useCoverLetterStore((s) => s.showInfoModal);
    const isGenerating = useCoverLetterStore((s) => s.isGenerating);
    const isLoading = useCoverLetterStore((s) => s.isLoading);
    const isSaving = useCoverLetterStore((s) => s.isSaving);
    const setShowInfoModal = useCoverLetterStore((s) => s.setShowInfoModal);
    const setViewModeStore = useCoverLetterStore((s) => s.setViewMode);
    const setDocument = useCoverLetterStore((s) => s.setDocument);
    const generateCoverLetter = useCoverLetterStore((s) => s.generateCoverLetter);
    const loadCoverLetter = useCoverLetterStore((s) => s.loadCoverLetter);
    const saveCoverLetter = useCoverLetterStore((s) => s.saveCoverLetter);

    const selectedJob = mockJobs.find((job) => job.id === selectedJobId) || mockJobs[0];
    const formDefaults = useCoverLetterDefaults();

    // On mount: if ?id= param is present, load that document from Firestore.
    // Otherwise reset state and open the creation modal (new document flow).
    useEffect(() => {
        const id = searchParams.get("id");
        if (id && user) {
            // Clear any previously in-memory doc before fetching
            setDocument(null);
            loadCoverLetter(user.uid, id);
        } else if (!id) {
            // New document — clear any stale state from a previous session
            setDocument(null);
            setShowInfoModal(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        setViewModeStore(viewMode);
    }, [viewMode, setViewModeStore]);

    function handleGenerate(formData: CoverLetterFormData) {
        generateCoverLetter(formData, selectedJobId, selectedJob.title);
    }

    const handleSave = useCallback(async () => {
        if (!user) return;
        await saveCoverLetter(user.uid);
    }, [user, saveCoverLetter]);

    const handleDownload = useCallback(async () => {
        if (!paperRef.current || !document) return;
        const filename = `${document.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;
        await downloadCoverLetterPdf(paperRef.current, filename);
    }, [document]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Modal — shown on page load or when user requests a new letter */}
            <CoverLetterInfoModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                initialValues={formDefaults}
            />

            <EditorHeader
                title="Cover Letter"
                subtitle={
                    document
                        ? `Tailored for: ${selectedJob.title}`
                        : isGenerating
                          ? "Generating…"
                          : "Create your cover letter"
                }
                jobs={mockJobs}
                selectedJobId={selectedJobId}
                onJobSelect={(id) => setSelectedJobId(id)}
                onRecommendationsOpen={() => setSidebarOpen((open) => !open)}
                onDownload={handleDownload}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                suggestionsCount={0}
                homeHref="/home"
                showConstraintMeter={false}
            />

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <div className="flex-1 min-w-0 overflow-hidden">
                    <CoverLetterEditor
                        jobId={selectedJobId}
                        viewMode={viewMode}
                        onRequestNew={() => setShowInfoModal(true)}
                        paperRef={paperRef}
                        isLoadingDoc={isLoading}
                    />
                </div>

                <aside
                    className={cx(
                        "flex flex-col border-l border-secondary bg-primary shrink-0 overflow-hidden transition-all duration-200 ease-in-out h-full",
                        sidebarOpen ? "w-[360px]" : "w-0 border-l-0"
                    )}
                >
                    {sidebarOpen && (
                        <div className="flex flex-col h-full min-h-0 w-[360px] min-w-[360px]">
                            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-secondary shrink-0">
                                <h2 className="text-sm font-semibold text-primary">Writing Tools</h2>
                                <CloseButton
                                    size="sm"
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Close sidebar"
                                />
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-6">
                                <CoverLetterWritingTips />
                                <CoverLetterMetrics />
                            </div>

                            {/* Save + Download action bar */}
                            <div className="shrink-0 p-4 border-t border-secondary bg-primary">
                                <div className="flex items-center gap-3">
                                    <Button
                                        size="md"
                                        color="secondary"
                                        iconLeading={Save01}
                                        isDisabled={!document || isGenerating || isSaving}
                                        onClick={handleSave}
                                    >
                                        {isSaving ? "Saving…" : "Save"}
                                    </Button>
                                    <Button
                                        size="md"
                                        color="primary"
                                        iconLeading={Download01}
                                        isDisabled={!document || isGenerating}
                                        onClick={handleDownload}
                                    >
                                        Download PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

const CoverLetterPage = () => {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <CoverLetterPageContent />
        </Suspense>
    );
};

export default CoverLetterPage;
