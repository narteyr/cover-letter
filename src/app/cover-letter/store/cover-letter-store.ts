import { create } from "zustand";
import type { CoverLetterFormData } from "../components/cover-letter-info-modal";
import {
  createCoverLetter,
  updateCoverLetter,
  getCoverLetter,
} from "@/lib/firebase/cover-letter-service";

export interface CoverLetterDocument {
    id: string;
    /** Firestore document id (null until first save) */
    firestoreId: string | null;
    jobId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface CoverLetterState {
    document: CoverLetterDocument | null;
    viewMode: "preview" | "edit";
    /** Modal is open waiting for the user to fill in company/role info */
    showInfoModal: boolean;
    /** Generation in progress (LLM call) */
    isGenerating: boolean;
    /** Error from the last generation attempt */
    generationError: string | null;
    /** Loading an existing document from Firestore */
    isLoading: boolean;
    /** Save in progress */
    isSaving: boolean;
    /** Error from the last save attempt */
    saveError: string | null;

    setDocument: (doc: CoverLetterDocument | null) => void;
    setContent: (content: string) => void;
    setJobId: (jobId: string) => void;
    setTitle: (title: string) => void;
    setViewMode: (mode: "preview" | "edit") => void;
    setShowInfoModal: (show: boolean) => void;
    setIsGenerating: (loading: boolean) => void;
    setGenerationError: (error: string | null) => void;

    /** Kick off a generation request and update document content on success */
    generateCoverLetter: (
        formData: CoverLetterFormData,
        jobId: string,
        jobTitle: string
    ) => Promise<void>;

    /**
     * Load an existing cover letter from Firestore by its document id.
     * Returns true if found, false if not found.
     */
    loadCoverLetter: (uid: string, firestoreId: string) => Promise<boolean>;

    /**
     * Save the current document to Firestore.
     * Creates a new doc on first save; updates thereafter.
     * Returns the Firestore docId.
     */
    saveCoverLetter: (uid: string) => Promise<string | null>;
}

export const useCoverLetterStore = create<CoverLetterState>((set, get) => ({
    document: null,
    viewMode: "preview",
    showInfoModal: false,
    isGenerating: false,
    generationError: null,
    isLoading: false,
    isSaving: false,
    saveError: null,

    setDocument: (doc) => set({ document: doc }),
    setContent: (content) =>
        set((state) => ({
            document: state.document
                ? {
                      ...state.document,
                      content,
                      updatedAt: new Date().toISOString(),
                  }
                : null,
        })),
    setJobId: (jobId) =>
        set((state) => ({
            document: state.document ? { ...state.document, jobId } : null,
        })),
    setTitle: (title) =>
        set((state) => ({
            document: state.document ? { ...state.document, title } : null,
        })),
    setViewMode: (viewMode) => set({ viewMode }),
    setShowInfoModal: (showInfoModal) => set({ showInfoModal }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setGenerationError: (generationError) => set({ generationError }),

    generateCoverLetter: async (formData, jobId, jobTitle) => {
        set({ isGenerating: true, generationError: null, showInfoModal: false });

        // Immediately create a blank document so the editor skeleton shows
        const now = new Date().toISOString();
        set({
            document: {
                id: `cl-${jobId}-${Date.now()}`,
                firestoreId: null,
                jobId,
                title: `Cover Letter — ${formData.jobTitle} at ${formData.companyName}`,
                content: "",
                createdAt: now,
                updatedAt: now,
            },
        });

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            // Insert generated HTML into the document
            set((state) => ({
                isGenerating: false,
                document: state.document
                    ? {
                          ...state.document,
                          content: data.html,
                          updatedAt: new Date().toISOString(),
                      }
                    : null,
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            set({ isGenerating: false, generationError: message });
        }
    },

    loadCoverLetter: async (uid, firestoreId) => {
        set({ isLoading: true, generationError: null });
        try {
            const doc = await getCoverLetter(uid, firestoreId);
            if (!doc) {
                set({ isLoading: false });
                return false;
            }
            set({
                isLoading: false,
                document: {
                    id: doc.id,
                    firestoreId: doc.id,
                    jobId: doc.jobId,
                    title: doc.title,
                    content: doc.content,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                },
            });
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            set({ isLoading: false, generationError: message });
            return false;
        }
    },

    saveCoverLetter: async (uid) => {
        const { document } = get();
        if (!document || !document.content) return null;

        set({ isSaving: true, saveError: null });

        try {
            let firestoreId = document.firestoreId;

            if (!firestoreId) {
                // First save — create a new Firestore document
                firestoreId = await createCoverLetter(uid, {
                    jobId: document.jobId,
                    title: document.title,
                    content: document.content,
                });

                set((state) => ({
                    isSaving: false,
                    document: state.document
                        ? { ...state.document, firestoreId }
                        : null,
                }));
            } else {
                // Subsequent save — update existing document
                await updateCoverLetter(uid, firestoreId, {
                    title: document.title,
                    content: document.content,
                });

                set({ isSaving: false });
            }

            return firestoreId;
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            set({ isSaving: false, saveError: message });
            return null;
        }
    },
}));
