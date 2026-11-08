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
                <div className="prose max-w-none rounded-md border border-neutral-200 p-3 text-[15px] leading-relaxed text-neutral-950 prose-p:my-2 prose-table:my-2 prose-table:w-full prose-table:text-[14px] prose-th:text-[14px] prose-th:font-semibold prose-th:py-2.5 prose-th:px-3.5 prose-th:text-neutral-900 prose-td:text-[14px] prose-td:py-2.5 prose-td:px-3.5 prose-td:text-neutral-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{tab.content}</ReactMarkdown>
                </div>
            </section>
        ))}
        {payload.wordLimit?.max ? (
            <p className="text-xs text-neutral-500">
                Limit: {payload.wordLimit.max} words.
            </p>
        ) : null}
    </div>
);
export default CaseFileTextAreaView;
