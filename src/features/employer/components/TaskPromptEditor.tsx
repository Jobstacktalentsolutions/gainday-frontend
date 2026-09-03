import { useEffect, type ReactNode } from "react";
import { useEditor, EditorContent, markdown } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { Bold, Italic, Link as LinkIcon, List } from "lucide-react";
import { cn } from "@/lib/utils";


interface TaskPromptEditorProps {
    value: string;
    onChange: (markdown: string) => void;
    error?: string;
    placeholder?: string;
}

const ToolbarButton = ({
    active, onClick, label, children
}: {
    active?: boolean;
    onClick: () => void;
    label: string;
    children: ReactNode;
}) => {
    <button
        type = "button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={active}
        className={cn(
            "flex size-8 items-center justify-center rounded-md text-neutral-500 transition-colors duration-150",
            "hover:bg-neutral-100 hover:text-neutral-900",
            active && "bg-primary-50 text-primary-600"
        )}
    >
        {children}
    </button>

}
