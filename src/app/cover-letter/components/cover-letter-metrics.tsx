"use client";

import { useMemo } from "react";
import { useCoverLetterStore } from "../store/cover-letter-store";
import { scoreDocument, type ScoredMetric, type ColorKey } from "../utils/score-document";

// ─── Color palette ────────────────────────────────────────────────────────────
// Each metric gets a distinct hue; we use utility-* tokens from the design system.

const COLOR_MAP: Record<
    ColorKey,
    { bar: string; label: string; badge: string }
> = {
    blue:   { bar: "bg-utility-blue-500",   label: "text-utility-blue-700",   badge: "bg-utility-blue-50" },
    violet: { bar: "bg-utility-purple-500", label: "text-utility-purple-700", badge: "bg-utility-purple-50" },
    green:  { bar: "bg-utility-success-500",label: "text-utility-success-700",badge: "bg-utility-success-50" },
    orange: { bar: "bg-utility-orange-500", label: "text-utility-orange-700", badge: "bg-utility-orange-50" },
    rose:   { bar: "bg-utility-error-400",  label: "text-utility-error-700",  badge: "bg-utility-error-50" },
};

// ─── Single metric row ────────────────────────────────────────────────────────

function MetricRow({ metric }: { metric: ScoredMetric }) {
    const colors = COLOR_MAP[metric.colorKey];

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-primary">{metric.label}</span>
                <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${colors.badge} ${colors.label}`}
                >
                    {metric.score}%
                </span>
            </div>
            {/* Track */}
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
                    style={{ width: `${metric.score}%` }}
                    role="progressbar"
                    aria-valuenow={metric.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={metric.label}
                />
            </div>
            <p className="text-xs text-tertiary leading-snug">{metric.hint}</p>
        </div>
    );
}

// ─── Overall score pill ───────────────────────────────────────────────────────

function OverallScore({ metrics }: { metrics: ScoredMetric[] }) {
    const avg = Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length);
    const label =
        avg >= 90 ? "Excellent" :
        avg >= 78 ? "Good" :
        avg >= 60 ? "Fair" : "Needs work";

    const color =
        avg >= 90 ? "text-utility-success-700 bg-utility-success-50" :
        avg >= 78 ? "text-utility-blue-700 bg-utility-blue-50" :
        avg >= 60 ? "text-utility-orange-700 bg-utility-orange-50" :
                    "text-utility-error-700 bg-utility-error-50";

    return (
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-secondary">
            <p className="text-xs font-medium text-tertiary">Overall quality</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
                {avg}% · {label}
            </span>
        </div>
    );
}

// ─── Main card ────────────────────────────────────────────────────────────────

export function CoverLetterMetrics() {
    const content = useCoverLetterStore((s) => s.document?.content ?? "");
    const isGenerating = useCoverLetterStore((s) => s.isGenerating);

    const metrics = useMemo(() => scoreDocument(content), [content]);

    // Don't render while generating or if there's not enough content yet
    if (isGenerating || metrics.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-primary">Document Quality</h3>

            <div className="flex flex-col gap-1 rounded-xl border border-secondary bg-primary p-4 shadow-sm">
                <OverallScore metrics={metrics} />

                <div className="flex flex-col gap-4 pt-3">
                    {metrics.map((m) => (
                        <MetricRow key={m.label} metric={m} />
                    ))}
                </div>
            </div>
        </div>
    );
}
