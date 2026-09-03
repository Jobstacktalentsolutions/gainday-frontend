import { useEffect, type ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
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
    return (
        <button
            type="button"
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
    );

}

const TaskPromptEditor = ({ value, onChange, error, placeholder }: TaskPromptEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false }),
            Link.configure({ openOnClick: false, autolink: true }),
            Placeholder.configure({
                placeholder: placeholder ?? "Write your detailed prompt instructions here...",
            }),
            Markdown.configure({ html: false, transformPastedText: true }),
        ],
        content: value,
        onUpdate : ({ editor }) => onChange((editor.storage as Record<string, any>).markdown.getMarkdown()),
        editorProps : {
            attributes : {
                class : "min-w-0 flex-1 outline-none text-base text-neutral-900 leading-relaxed [&_p]:min-h-[1.5em]",
            },
        },
    });

    //to keep the editor synced when the field value changes externaly
    useEffect(() => {
        if (!editor)  return ;
        const current = (editor.storage as Record<string, any>).markdown.getMarkdown();
        if (value != current) editor.commands.setContent(value, { emitUpdate: false });
    })
}
