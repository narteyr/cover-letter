"use client";

import { useState, useEffect, useRef } from "react";
import { TypeSquare, TextInput, Bold01, Italic01 } from "@untitledui/icons";
import type { Editor } from "@tiptap/react";
import { cx } from "@/utils/cx";

interface CoverLetterFormattingToolbarProps {
    editor: Editor | null;
    containerRef?: React.RefObject<HTMLDivElement | null>;
}

const FONTS = [
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Calibri", value: "Calibri, sans-serif" },
    { name: "Garamond", value: "Garamond, serif" },
];

const FONT_SIZES = [
    { label: "10pt", value: "10pt" },
    { label: "11pt", value: "11pt" },
    { label: "12pt", value: "12pt" },
    { label: "14pt", value: "14pt" },
];

// ─── Small divider ────────────────────────────────────────────────────────────

function Divider() {
    return <div className="w-5 h-px bg-secondary mx-auto" />;
}

// ─── Toolbar icon button ──────────────────────────────────────────────────────

interface ToolButtonProps {
    label: string;
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

function ToolButton({ label, active, onClick, children }: ToolButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={cx(
                "flex items-center justify-center size-8 rounded-lg transition-colors duration-100",
                active
                    ? "bg-brand-50 text-fg-brand-primary"
                    : "text-secondary hover:bg-secondary hover:text-primary"
            )}
        >
            {children}
        </button>
    );
}

// ─── Flyout panel ─────────────────────────────────────────────────────────────

interface FlyoutProps {
    children: React.ReactNode;
}

function Flyout({ children }: FlyoutProps) {
    return (
        <div className="absolute left-full ml-2 top-0 min-w-[160px] bg-primary border border-secondary rounded-xl shadow-lg overflow-hidden z-50">
            {children}
        </div>
    );
}

interface FlyoutItemProps {
    label: string;
    active: boolean;
    onClick: () => void;
    style?: React.CSSProperties;
}

function FlyoutItem({ label, active, onClick, style }: FlyoutItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={style}
            className={cx(
                "w-full px-4 py-2 text-left text-sm transition-colors",
                active
                    ? "bg-brand-50 text-fg-brand-primary font-medium"
                    : "text-primary hover:bg-secondary"
            )}
        >
            {label}
        </button>
    );
}

// ─── Main toolbar ─────────────────────────────────────────────────────────────

export function CoverLetterFormattingToolbar({
    editor,
    containerRef,
}: CoverLetterFormattingToolbarProps) {
    const [openPanel, setOpenPanel] = useState<"font" | "size" | null>(null);
    const [leftPosition, setLeftPosition] = useState(16);
    const toolbarRef = useRef<HTMLDivElement>(null);

    // ── Position: track container's left edge ──────────────────────────────
    useEffect(() => {
        const update = () => {
            if (containerRef?.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setLeftPosition(rect.left + 16);
            }
        };

        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update);
        };
    }, [containerRef]);

    // ── Close panel when clicking outside toolbar ──────────────────────────
    useEffect(() => {
        if (!openPanel) return;
        const handler = (e: MouseEvent) => {
            if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
                setOpenPanel(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [openPanel]);

    if (!editor) return null;

    const currentFont =
        editor.getAttributes("textStyle").fontFamily ?? "Times New Roman, serif";
    const currentSize =
        editor.getAttributes("textStyle").fontSize ?? "11pt";
    const isBold = editor.isActive("bold");
    const isItalic = editor.isActive("italic");

    const toggle = (panel: "font" | "size") =>
        setOpenPanel((p) => (p === panel ? null : panel));

    const applyFont = (value: string) => {
        editor.chain().focus().selectAll().setFontFamily(value).run();
        setOpenPanel(null);
    };

    const applySize = (value: string) => {
        editor.chain().focus().selectAll().setFontSize(value).run();
        setOpenPanel(null);
    };

    return (
        <div
            ref={toolbarRef}
            className="fixed top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col"
            style={{ left: `${leftPosition}px` }}
        >
            <div className="flex flex-col items-center gap-1.5 p-1.5 bg-primary border border-secondary rounded-xl shadow-md">

                {/* ── Font family ── */}
                <div className="relative">
                    <ToolButton
                        label="Font family"
                        active={openPanel === "font"}
                        onClick={() => toggle("font")}
                    >
                        <TypeSquare className="size-4" />
                    </ToolButton>
                    {openPanel === "font" && (
                        <Flyout>
                            {FONTS.map((f) => (
                                <FlyoutItem
                                    key={f.value}
                                    label={f.name}
                                    active={currentFont === f.value}
                                    onClick={() => applyFont(f.value)}
                                    style={{ fontFamily: f.value }}
                                />
                            ))}
                        </Flyout>
                    )}
                </div>

                {/* ── Font size ── */}
                <div className="relative">
                    <ToolButton
                        label="Font size"
                        active={openPanel === "size"}
                        onClick={() => toggle("size")}
                    >
                        <TextInput className="size-4" />
                    </ToolButton>
                    {openPanel === "size" && (
                        <Flyout>
                            {FONT_SIZES.map((s) => (
                                <FlyoutItem
                                    key={s.value}
                                    label={s.label}
                                    active={currentSize === s.value}
                                    onClick={() => applySize(s.value)}
                                />
                            ))}
                        </Flyout>
                    )}
                </div>

                <Divider />

                {/* ── Bold ── */}
                <ToolButton
                    label="Bold"
                    active={isBold}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold01 className="size-4" />
                </ToolButton>

                {/* ── Italic ── */}
                <ToolButton
                    label="Italic"
                    active={isItalic}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic01 className="size-4" />
                </ToolButton>
            </div>
        </div>
    );
}
