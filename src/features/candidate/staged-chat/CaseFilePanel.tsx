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
            <div role="tabpanel" className="prose prose-sm max-w-none overflow-y-auto p-4 text-neutral-950">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.content}</ReactMarkdown>
            </div>
        </section>
    );
};

export default CaseFilePanel;
