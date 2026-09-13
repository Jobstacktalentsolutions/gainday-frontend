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
                // Prose styles applied directly so the WYSIWYG output matches
                // the GitHub-style rendered markdown preview.
                class: [
                    "min-w-0 flex-1 outline-none text-base text-neutral-900 leading-relaxed",
                    "[&_p]:min-h-[1.5em]",
                    // Headings
                    "[&_h1]:text-2xl [&_h1]:font-bold   [&_h1]:text-neutral-900 [&_h1]:mt-4 [&_h1]:mb-1",
                    "[&_h2]:text-xl  [&_h2]:font-semibold [&_h2]:text-neutral-900 [&_h2]:mt-3 [&_h2]:mb-1",
                    "[&_h3]:text-lg  [&_h3]:font-semibold [&_h3]:text-neutral-800 [&_h3]:mt-2 [&_h3]:mb-0.5",
                    // Bullet / ordered lists — GitHub-style indented disc bullets
                    "[&_ul]:list-disc   [&_ul]:pl-5 [&_ul]:my-1 [&_ul_li]:my-0.5",
                    "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1 [&_ol_li]:my-0.5",
                    // Inline code
                    "[&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:text-sm [&_code]:font-mono",
                    // Links
                    "[&_a]:text-primary-600 [&_a]:underline",
                ].join(" "),
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

    // Detect active heading level so the icon updates in real time
    const activeHeadingLevel =
        editor?.isActive("heading", { level: 1 }) ? 1 :
        editor?.isActive("heading", { level: 2 }) ? 2 :
        editor?.isActive("heading", { level: 3 }) ? 3 : null;

    // Cycle: none → H1 → H2 → H3 → paragraph (matches GitHub toolbar behaviour)
    const handleHeadingClick = () => {
        if (!editor) return;
        if (activeHeadingLevel === 1) editor.chain().focus().setHeading({ level: 2 }).run();
        else if (activeHeadingLevel === 2) editor.chain().focus().setHeading({ level: 3 }).run();
        else if (activeHeadingLevel === 3) editor.chain().focus().setParagraph().run();
        else editor.chain().focus().setHeading({ level: 1 }).run();
    };

    const HeadingIcon =
        activeHeadingLevel === 2 ? Heading2 :
        activeHeadingLevel === 3 ? Heading3 :
        Heading1;

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
                    {/* Heading — cycles H1 → H2 → H3 → paragraph */}
                    <ToolbarButton
                        label={activeHeadingLevel ? `Heading ${activeHeadingLevel} — click to cycle` : "Heading"}
                        active={activeHeadingLevel !== null}
                        onClick={handleHeadingClick}
                    >
                        <HeadingIcon className="size-3.5" />
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
