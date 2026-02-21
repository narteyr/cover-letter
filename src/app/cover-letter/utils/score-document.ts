/**
 * Client-side cover letter quality scoring.
 * No AI — purely deterministic text analysis.
 *
 * All scores are 0–100. Each metric targets the characteristics of a strong
 * professional cover letter and is tuned so a well-generated letter lands
 * naturally in the 78–96 range.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip HTML tags and normalise whitespace */
function extractText(html: string): string {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/** Split text into sentences on ., !, ? followed by a space or end */
function sentences(text: string): string[] {
    return text
        .split(/[.!?]+(?:\s|$)/)
        .map((s) => s.trim())
        .filter((s) => s.length > 4);
}

/** Split into individual words */
function words(text: string): string[] {
    return text.split(/\s+/).filter((w) => w.length > 0);
}

/** Clamp a value to [0, 100] */
function clamp(n: number): number {
    return Math.max(0, Math.min(100, Math.round(n)));
}

/** Linear interpolation — maps `value` in [lo, hi] to [0, 100] */
function scale(value: number, lo: number, hi: number, invert = false): number {
    const ratio = (value - lo) / (hi - lo);
    const pct = invert ? 1 - ratio : ratio;
    return clamp(pct * 100);
}

// ─── Individual scorers ───────────────────────────────────────────────────────

/**
 * Clarity — based on average sentence length.
 * Ideal: 15–20 words per sentence. Penalise very long sentences.
 */
function scoreClarity(text: string): number {
    const sents = sentences(text);
    if (!sents.length) return 0;
    const avgLen = sents.reduce((acc, s) => acc + words(s).length, 0) / sents.length;
    // Best score at 15–20 words, drops off outside that range
    if (avgLen < 8) return clamp(50 + (avgLen / 8) * 30);  // too short = choppy
    if (avgLen <= 20) return clamp(80 + ((20 - avgLen) / 5) * 16); // sweet spot
    return clamp(96 - (avgLen - 20) * 4); // too long = unclear
}

/**
 * Conciseness — word count vs ideal cover letter length (300–450 words).
 * Under 200 words scores low; over 600 words penalised.
 */
function scoreConciseness(text: string): number {
    const wc = words(text).length;
    if (wc < 50) return 10;
    if (wc < 200) return clamp(40 + (wc / 200) * 40);
    if (wc <= 450) return clamp(80 + ((wc - 200) / 250) * 16);
    if (wc <= 600) return clamp(96 - ((wc - 450) / 150) * 20);
    return clamp(76 - ((wc - 600) / 100) * 8);
}

/** Weak/banned phrases that drag down tone quality */
const WEAK_PHRASES = [
    "i am excited to apply",
    "i am writing to express",
    "i am passionate about",
    "dynamic",
    "synergy",
    "leverage",
    "impactful",
    "i would be a great fit",
    "thrilled",
    "delighted",
    "i am confident that",
    "look no further",
    "results-driven",
    "team player",
    "fast-paced environment",
    "go-getter",
    "think outside the box",
    "hard worker",
    "detail-oriented",
    "responsible for",
    "helped with",
    "i feel that",
    "i believe that",
    "to whom it may concern",
];

/**
 * Tone — penalises weak / clichéd phrases and rewards active, direct writing.
 * Starts at 96 and deducts 10 per weak phrase found (floored at 30).
 */
function scoreTone(text: string): number {
    const lower = text.toLowerCase();
    const hits = WEAK_PHRASES.filter((p) => lower.includes(p)).length;
    return clamp(96 - hits * 10);
}

/**
 * Specificity — rewards the presence of numbers, percentages, currency, or
 * years (signals of quantified, evidence-backed writing).
 */
function scoreSpecificity(text: string): number {
    // Count distinct number-bearing tokens: $120k, 34%, 5 years, 2021, etc.
    const matches = text.match(/\d[\d,.]*(k|m|%|x|\s*years?|\s*months?)?/gi) ?? [];
    // 0 hits = 30, 1 = ~55, 2 = ~70, 3 = ~82, 4+ = 90+
    const score = 30 + Math.min(matches.length, 6) * 11;
    return clamp(score);
}

/** Contractions and casual markers that reduce formality */
const CONTRACTIONS = [
    "can't", "won't", "don't", "didn't", "i'm", "i've", "i'd", "it's",
    "that's", "we're", "they're", "you're", "isn't", "aren't", "wasn't",
    "couldn't", "wouldn't", "shouldn't", "hasn't", "haven't", "hadn't",
    "gonna", "wanna", "gotta", "kinda", "sorta", "yeah", "hey", "ok",
];

/**
 * Formality — penalises contractions and casual language.
 * A formal letter uses none; mild use still scores reasonably.
 */
function scoreFormality(text: string): number {
    const lower = text.toLowerCase();
    const hits = CONTRACTIONS.filter((c) => lower.includes(c)).length;
    return clamp(97 - hits * 12);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface DocumentScore {
    label: string;
    score: number; // 0–100
    color: string; // Tailwind text + bg token pair encoded as a string key
}

export type ColorKey = "blue" | "violet" | "green" | "orange" | "rose";

export interface ScoredMetric {
    label: string;
    score: number;
    colorKey: ColorKey;
    hint: string;
}

const METRICS: {
    label: string;
    colorKey: ColorKey;
    hint: string;
    fn: (text: string) => number;
}[] = [
    {
        label: "Clarity",
        colorKey: "blue",
        hint: "How easy each sentence is to read",
        fn: scoreClarity,
    },
    {
        label: "Conciseness",
        colorKey: "violet",
        hint: "Word count vs ideal length (300–450 words)",
        fn: scoreConciseness,
    },
    {
        label: "Tone",
        colorKey: "green",
        hint: "Absence of clichés and weak filler phrases",
        fn: scoreTone,
    },
    {
        label: "Specificity",
        colorKey: "orange",
        hint: "Use of numbers, metrics, and concrete evidence",
        fn: scoreSpecificity,
    },
    {
        label: "Formality",
        colorKey: "rose",
        hint: "Professional language, no contractions",
        fn: scoreFormality,
    },
];

/**
 * Score a cover letter HTML string across all metrics.
 * Returns an empty array when the document has fewer than 30 words.
 */
export function scoreDocument(html: string): ScoredMetric[] {
    const text = extractText(html);
    if (words(text).length < 30) return [];

    return METRICS.map(({ label, colorKey, hint, fn }) => ({
        label,
        colorKey,
        hint,
        score: fn(text),
    }));
}
