import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { CaseFileTextAreaPayload } from "@/features/simulation-tasks/types";
import ReadOnlyAnswerText from "./ReadOnlyAnswerText";
import type { InterfaceAnswerProps } from "./types";

interface Props extends Omit<InterfaceAnswerProps, "payload"> {
    payload: CaseFileTextAreaPayload;
}

const MAX_CHARS = 1000;

// The case file is reference material: read-only tabs (customer record, ticket, policy) the
// candidate works from. Tabs switch in place, so the written answer stays on screen beneath them.
const CaseFileTextAreaAnswer = ({ payload, value, onChange, objectiveSlot, readOnly }: Props) => {
    const [activeTab, setActiveTab] = useState(0);
    const { tabs } = payload.caseFile;

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="w-full overflow-hidden rounded-xl border border-neutral-200">
                <div role="tablist" className="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 px-2 pt-2">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            type="button"
                            role="tab"
                            aria-selected={index === activeTab}
                            onClick={() => setActiveTab(index)}
                            className={cn(
                                "rounded-t-lg px-3.5 py-2 text-sm",
                                index === activeTab
                                    ? "bg-white font-medium text-neutral-950"
                                    : "text-neutral-500 hover:text-neutral-800",
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div role="tabpanel" className="prose prose-sm max-w-none p-4 text-neutral-950">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{tabs[activeTab].content}</ReactMarkdown>
                </div>
            </div>

            {objectiveSlot}

            {readOnly ? (
                <ReadOnlyAnswerText value={value} />
            ) : (
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value.slice(0, MAX_CHARS))}
                    placeholder={payload.placeholder ?? "Type your response here..."}
                    className="h-38.25 w-full resize-none rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none placeholder:text-neutral-400 focus:border-primary-500"
                />
            )}
        </div>
    );
};

export default CaseFileTextAreaAnswer;
