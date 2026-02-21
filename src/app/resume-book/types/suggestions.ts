export interface Suggestion {
  id: string;
  sectionId: string;
  nodeId?: string;
  originalText: string;
  suggestedText?: string;
  range: { startOffset: number; endOffset: number };
}
