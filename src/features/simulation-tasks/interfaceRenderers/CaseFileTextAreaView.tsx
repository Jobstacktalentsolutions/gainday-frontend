import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { CaseFileTextAreaPayload } from "../types";

interface Props {
    payload: CaseFileTextAreaPayload;
    mode: "preview" | "edit";
}

// The case file is the material the candidate works from. Employers see it as the candidate does.
// It is derived from the task's policy or figures when the task is generated, so it is not edited
// here: the server rejects a change to it, and the employer regenerates the task instead.
const CaseFileTextAreaView = ({ payload }: Props) => (
    <div className="flex flex-col gap-4">
        {payload.caseFile.tabs.map((tab) => (
            <section key={tab.label} className="flex flex-col gap-1.5">
                <h4 className="text-sm font-medium text-neutral-700">{tab.label}</h4>
                <div className="prose prose-sm max-w-none rounded-md border border-neutral-200 p-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{tab.content}</ReactMarkdown>
                </div>
            </section>
        ))}
        {payload.wordLimit && (
            <p className="text-xs text-neutral-500">
                Asks for {payload.wordLimit.min} to {payload.wordLimit.max} words.
            </p>
        )}
    </div>
);
export default CaseFileTextAreaView;
