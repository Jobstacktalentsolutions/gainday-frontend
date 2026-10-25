import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TaskPromptEditor from "@/features/employer/components/TaskPromptEditor";
import type { RichTextComposerPayload } from "@/features/simulation-tasks/types";

interface Props {
    payload: RichTextComposerPayload;
    value: string;
    onChange: (value: string) => void;
    /** The task's structured answer widget, shown above the written response. */
    objectiveSlot?: ReactNode;
    readOnly?: boolean;
}

// A rich-text answer: bold, italics, headings, lists, links and tables, stored as Markdown. Review
// pages render the same Markdown read-only, so what the candidate formatted is what the employer reads.
const RichTextComposerAnswer = ({ payload, value, onChange, objectiveSlot, readOnly }: Props) => (
    <div className="flex w-full flex-col gap-4">
        {objectiveSlot}
        {readOnly ? (
            <div className="prose prose-sm max-w-none rounded-lg border border-neutral-200 p-4 text-neutral-950">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
        ) : (
            <TaskPromptEditor
                value={value}
                onChange={onChange}
                placeholder={payload.placeholder ?? "Write your response..."}
                contentClassName="min-h-40 max-h-96 overflow-y-auto"
            />
        )}
    </div>
);

export default RichTextComposerAnswer;
