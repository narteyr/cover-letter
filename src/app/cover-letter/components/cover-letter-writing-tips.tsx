"use client";

import { Edit01, Target01, FileCheck03 } from "@untitledui/icons";
import { DefaultCard } from "@/components/cards/default-card";

const WRITING_TIPS = [
    {
        icon: Edit01,
        title: "Opening impact",
        description: "Start with a strong hook that connects your experience to the role.",
    },
    {
        icon: Target01,
        title: "Quantified achievements",
        description: "Include numbers and results to demonstrate your impact.",
    },
    {
        icon: FileCheck03,
        title: "Company research",
        description: "Reference specific company initiatives or values to show genuine interest.",
    },
];

export function CoverLetterWritingTips() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-primary">Writing Tips</h3>
            <div className="flex flex-col gap-3">
                {WRITING_TIPS.map((tip) => (
                    <DefaultCard
                        key={tip.title}
                        cardClassName="p-3 rounded-xl bg-primary border border-secondary shadow-sm"
                        childProp={
                            <div className="flex gap-3">
                                <div className="shrink-0 p-1.5 rounded-lg bg-brand-50">
                                    <tip.icon className="size-4 text-brand-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-primary">{tip.title}</p>
                                    <p className="text-xs text-tertiary mt-0.5">{tip.description}</p>
                                </div>
                            </div>
                        }
                    />
                ))}
            </div>
        </div>
    );
}
