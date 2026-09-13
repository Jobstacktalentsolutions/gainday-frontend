import { useEffect, type ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { Bold, Italic, Link as LinkIcon, List, Heading1, Heading2, Heading3 } from "lucide-react";
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
            // Prevent mousedown from stealing focus/selection from the editor
            // before the click handler fires — critical for all toolbar commands.
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
            className={cn(
                "flex size-8 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors duration-150",
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
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
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
                class: "tpe-content min-w-0 flex-1 outline-none text-base text-neutral-900 leading-relaxed",
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
        <div className="flex flex-col gap-1.5 text-left">
            <div
                className={cn(
                    "rounded-xl border bg-white transition-all duration-200",
                    "border-neutral-200",
                    hasError && "border-error-400 ring-3 ring-error-400/20"
                )}
            >
                <div className="flex items-center gap-1 border-b border-neutral-200 bg-neutral-50/50 p-2">
                    {/* H1 / H2 / H3 — each button independently toggles its heading level */}
                    <ToolbarButton
                        label="Heading 1"
                        active={editor?.isActive("heading", { level: 1 })}
                        onClick={() =>
                            editor?.isActive("heading", { level: 1 })
                                ? editor.chain().focus().setParagraph().run()
                                : editor?.chain().focus().setHeading({ level: 1 }).run()
                        }
                    >
                        <Heading1 className="size-3.5" />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Heading 2"
                        active={editor?.isActive("heading", { level: 2 })}
                        onClick={() =>
                            editor?.isActive("heading", { level: 2 })
                                ? editor.chain().focus().setParagraph().run()
                                : editor?.chain().focus().setHeading({ level: 2 }).run()
                        }
                    >
                        <Heading2 className="size-3.5" />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Heading 3"
                        active={editor?.isActive("heading", { level: 3 })}
                        onClick={() =>
                            editor?.isActive("heading", { level: 3 })
                                ? editor.chain().focus().setParagraph().run()
                                : editor?.chain().focus().setHeading({ level: 3 }).run()
                        }
                    >
                        <Heading3 className="size-3.5" />
                    </ToolbarButton>

                    <span className="mx-1 h-4 w-px bg-neutral-200" aria-hidden="true" />

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
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                    >
                        <Italic className="size-3.5" />
                    </ToolbarButton>

                    <span className="mx-1 h-4 w-px bg-neutral-200" aria-hidden="true" />

                    <ToolbarButton
                        label="Link"
                        active={editor?.isActive("link")}
                        onClick={() => {
                            const raw = window.prompt("URL")?.trim();
                            if (!raw) return;
                            // Ensure an absolute URL — without a protocol the browser
                            // treats it as a relative path and appends it to the current route.
                            const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
                            editor?.chain().focus().setLink({ href }).run();
                        }}
                    >
                        <LinkIcon className="size-3.5" />
                    </ToolbarButton>

                    {/* Bullet list — toggles disc-bullet list on the selected lines,
                        GitHub-style: each line becomes a `- ` item in the markdown output */}
                    <ToolbarButton
                        label="Bulleted list"
                        active={editor?.isActive("bulletList")}
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    >
                        <List className="size-3.5" />
                    </ToolbarButton>
                </div>
                <div className="min-h-45 px-4 py-3">
                    {/* Scoped prose styles — keeps heading/list/link rules self-contained
                        and avoids relying on Tailwind scanning dynamic class arrays. */}
                    <style>{`
                        .tpe-content p          { min-height: 1.5em; }
                        .tpe-content h1         { font-size: 1.5rem;   font-weight: 700; color: #171717; margin-top: 1rem;   margin-bottom: 0.25rem; line-height: 1.2; }
                        .tpe-content h2         { font-size: 1.25rem;  font-weight: 600; color: #171717; margin-top: 0.75rem; margin-bottom: 0.25rem; line-height: 1.3; }
                        .tpe-content h3         { font-size: 1.125rem; font-weight: 600; color: #262626; margin-top: 0.5rem;  margin-bottom: 0.125rem; line-height: 1.3; }
                        .tpe-content ul         { list-style-type: disc;    padding-left: 1.25rem; margin: 0.25rem 0; }
                        .tpe-content ol         { list-style-type: decimal; padding-left: 1.25rem; margin: 0.25rem 0; }
                        .tpe-content li         { margin: 0.125rem 0; }
                        .tpe-content a          { color: #4f46e5; text-decoration: underline; }
                        .tpe-content code       { background: #f5f5f5; border-radius: 0.25rem; padding: 0 0.25rem; font-size: 0.875rem; font-family: monospace; }
                        .tpe-content strong     { font-weight: 700; }
                        .tpe-content em         { font-style: italic; }
                    `}</style>
                    <EditorContent editor={editor} />
                </div>

            </div>
            {hasError && (
                <p role="alert" className="text-sm text-error-500">
                    {error}
                </p>
            )}
        </div>
    )
}

export default TaskPromptEditor;
