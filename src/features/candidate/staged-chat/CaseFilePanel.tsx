import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface Props {
    tabs: { label: string; content: string }[];
}

// The case file is read-only reference material. Tabs switch inside the page, so the chat stays on
// screen and nothing here looks like leaving the page to the candidate's anti-cheat guard.
const CaseFilePanel = ({ tabs }: Props) => {
    const [activeTab, setActiveTab] = useState(0);
    const active = tabs[activeTab];

    return (
        <section aria-label="Case file" className="flex min-h-0 w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div role="tablist" className="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 px-2 pt-2">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.label}
                        type="button"
                        role="tab"
                        aria-selected={index === activeTab}
                        onClick={() => setActiveTab(index)}
                        className={cn(
                            "rounded-t-lg px-3 py-2 text-sm",
                            index === activeTab ? "bg-white font-medium text-neutral-950" : "text-neutral-500 hover:text-neutral-800",
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div
                role="tabpanel"
                className="prose max-w-none overflow-y-auto p-4 text-[15px] leading-relaxed text-neutral-950 prose-p:my-2 prose-table:my-2 prose-table:w-full prose-table:text-[14px] prose-th:text-[14px] prose-th:font-semibold prose-th:py-2.5 prose-th:px-3.5 prose-th:text-neutral-900 prose-td:text-[14px] prose-td:py-2.5 prose-td:px-3.5 prose-td:text-neutral-800"
            >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.content}</ReactMarkdown>
            </div>
        </section>
    );
};

export default CaseFilePanel;
