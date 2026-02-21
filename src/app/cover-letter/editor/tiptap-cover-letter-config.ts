/**
 * Tiptap editor configuration for cover letter editing
 * Simpler than resume - prose document with paragraphs only
 */

import { useEditor, type EditorOptions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { FontSize } from "@tiptap/extension-font-size";

export function createCoverLetterEditorConfig(
    content: string,
    options?: {
        editable?: boolean;
        onUpdate?: (html: string) => void;
    }
): Partial<EditorOptions> {
    return {
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: "Start writing your cover letter...",
            }),
            TextStyle,
            FontFamily.configure({
                types: ["textStyle"],
            }),
            FontSize.configure({
                types: ["textStyle"],
            }),
        ],
        content: content || "<p></p>",
        editable: options?.editable ?? true,
        editorProps: {
            attributes: {
                class:
                    "cover-letter-editor-content prose prose-sm max-w-none focus:outline-none min-h-[400px] px-8 py-6",
            },
        },
        onUpdate: ({ editor }) => {
            if (options?.onUpdate) {
                options.onUpdate(editor.getHTML());
            }
        },
    };
}

export function useCoverLetterEditor(
    content: string,
    options?: {
        editable?: boolean;
        onUpdate?: (html: string) => void;
        documentId?: string; // Recreate editor when document (job) changes
    }
) {
    const config = createCoverLetterEditorConfig(content, options);

    return useEditor(
        {
            ...config,
            immediatelyRender: false,
        } as Partial<EditorOptions>,
        [options?.documentId ?? content]
    );
}
