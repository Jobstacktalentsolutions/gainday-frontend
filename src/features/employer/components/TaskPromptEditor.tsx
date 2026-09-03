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
        onUpdate: ({ editor }) => onChange((editor.storage as Record<string, any>).markdown.getMarkdown()),
        editorProps: {
            attributes: {
                class: "min-w-0 flex-1 outline-none text-base text-neutral-900 leading-relaxed [&_p]:min-h-[1.5em]",
            },
        },
    });

    //to keep the editor synced when the field value changes externaly
    useEffect(() => {
        if (!editor) return;
        const current = (editor.storage as Record<string, any>).markdown.getMarkdown();
        if (value != current) editor.commands.setContent(value, { emitUpdate: false });
        //emitUpdate prevents inifite calls to this effect
    }, [value, editor]);

    const hasError = Boolean(error);

    return (
        <div className="flex flex-col gap-1.5">
            <div
                className={cn(
                    "rounded-xl border bg-white transition-all duration-200",
                    "border-neutral-200",
                    hasError && "border-error-400 ring-3 ring-error-400/20"
                )}
            >
                <div className="flex items-center gap-1 border-b border-neutral-200 bg-neutral-50/50 p-2">
                    <ToolbarButton
                        label="Bold"
                        active={editor?.isActive("bold")}
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                    >
                        <Bold className="size-3.5" />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Italic"
                        active={editor?.isActive("italic")}
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                    >
                        <Italic className="size-3.5" />
                    </ToolbarButton>
                    <span className="mx-1 h-4 w-px bg-neutral-200" aria-hidden="true" />
                    <ToolbarButton
                        label="Link"
                        active={editor?.isActive("link")}
                        onClick={() => {
                            const url = window.prompt("URL");
                            if (url) editor?.chain().focus().setLink({ href: url }).run();
                        }}
                    >
                        <LinkIcon className="size-3.5" />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Bulleted list"
                        active={editor?.isActive("bulletList")}
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    >
                        <List className="size-3.5" />
                    </ToolbarButton>
                </div>

            </div>
        </div>
    )
}
