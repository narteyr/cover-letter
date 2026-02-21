import { create } from "zustand";
import type { ResumeDocument, DecorationRange } from "../types/resume-ast";
import type { Suggestion } from "../types/suggestions";

/** Minimal store for cover letter standalone mode - resumeAST is null when no resume loaded */
interface ResumeEditorState {
  resumeAST: ResumeDocument | null;
  suggestions: Map<string, Suggestion>;
  selectedSuggestionId: string | null;
  decorations: Map<string, DecorationRange>;
  pageUsage: number;
  isAnalyzing: boolean;
  isLoading: boolean;
  error: string | null;
  isRateLimited: boolean;
  rateLimitRetryAfter: number | null;
  achievementCache: Map<string, unknown>;
  suggestionCache: Map<string, unknown>;
  setResumeAST: (resume: ResumeDocument | null) => void;
  updateResumeAST: (updater: (resume: ResumeDocument) => ResumeDocument, _fromSuggestion?: boolean) => void;
  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: string) => void;
  addSuggestion: (suggestion: Suggestion) => void;
  addSuggestions: (suggestions: Suggestion[]) => void;
  removeSuggestion: (suggestionId: string) => void;
  clearSuggestions: () => void;
  selectSuggestion: (suggestionId: string | null) => void;
  addDecoration: (decoration: DecorationRange) => void;
  removeDecoration: (decorationId: string) => void;
  clearDecorations: () => void;
  removeDecorationsBySuggestion: (suggestionId: string) => void;
  applySuggestion: (suggestionId: string) => void;
  rejectSuggestion: (suggestionId: string) => void;
  ignoreSuggestion: (suggestionId: string) => void;
  removeBulletPoint: (suggestionId: string) => void;
  getCachedAchievements: (_cacheKey: string, _resumeHash: string) => unknown[] | null;
  setCachedAchievements: (_cacheKey: string, _achievements: unknown[], _jobContext: unknown, _resumeHash: string) => void;
  clearAchievementCache: () => void;
  invalidateCacheForResume: (_resumeHash: string) => void;
  removeAchievementFromCache: (_achievementId: string) => void;
  getCachedSuggestions: (_cacheKey: string, _resumeHash: string) => { suggestions: Suggestion[]; decorations: DecorationRange[] } | null;
  setCachedSuggestions: (_cacheKey: string, _suggestions: Suggestion[], _decorations: DecorationRange[], _jobContext: unknown, _resumeHash: string) => void;
  updateCachedSuggestionHash: (_cacheKey: string, _newResumeHash: string) => void;
  clearSuggestionCache: () => void;
  setPageUsage: (usage: number) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setRateLimited: (isRateLimited: boolean, retryAfter?: number) => void;
  clearRateLimit: () => void;
  resetStore: () => void;
  handleManualEdit: (_updatedDoc: ResumeDocument, _editedNodeIds: string[]) => void;
}

const noop = () => {};

export const useResumeEditorStore = create<ResumeEditorState>((set, get) => ({
  resumeAST: null,
  suggestions: new Map(),
  selectedSuggestionId: null,
  decorations: new Map(),
  pageUsage: 0,
  isAnalyzing: false,
  isLoading: false,
  error: null,
  isRateLimited: false,
  rateLimitRetryAfter: null,
  achievementCache: new Map(),
  suggestionCache: new Map(),
  setResumeAST: (resume) => set({ resumeAST: resume }),
  updateResumeAST: (updater) => {
    const current = get().resumeAST;
    if (current) set({ resumeAST: updater(current) });
  },
  setFontFamily: noop,
  setFontSize: noop,
  addSuggestion: noop,
  addSuggestions: noop,
  removeSuggestion: noop,
  clearSuggestions: () => set({ suggestions: new Map(), selectedSuggestionId: null }),
  selectSuggestion: (id) => set({ selectedSuggestionId: id }),
  addDecoration: noop,
  removeDecoration: noop,
  clearDecorations: () => set({ decorations: new Map() }),
  removeDecorationsBySuggestion: noop,
  applySuggestion: noop,
  rejectSuggestion: noop,
  ignoreSuggestion: noop,
  removeBulletPoint: noop,
  getCachedAchievements: () => null,
  setCachedAchievements: noop,
  clearAchievementCache: () => set({ achievementCache: new Map() }),
  invalidateCacheForResume: noop,
  removeAchievementFromCache: noop,
  getCachedSuggestions: () => null,
  setCachedSuggestions: noop,
  updateCachedSuggestionHash: noop,
  clearSuggestionCache: () => set({ suggestionCache: new Map() }),
  setPageUsage: (usage) => set({ pageUsage: usage }),
  setAnalyzing: (is) => set({ isAnalyzing: is }),
  setLoading: (is) => set({ isLoading: is }),
  setError: (err) => set({ error: err }),
  setRateLimited: (is, retry) => set({ isRateLimited: is, rateLimitRetryAfter: retry ?? null }),
  clearRateLimit: () => set({ isRateLimited: false, rateLimitRetryAfter: null, error: null }),
  resetStore: () =>
    set({
      resumeAST: null,
      suggestions: new Map(),
      selectedSuggestionId: null,
      decorations: new Map(),
      pageUsage: 0,
      isAnalyzing: false,
      isLoading: false,
      error: null,
      achievementCache: new Map(),
      suggestionCache: new Map(),
    }),
  handleManualEdit: (doc) => set({ resumeAST: doc }),
}));
