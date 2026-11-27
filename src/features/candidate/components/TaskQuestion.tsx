import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** What the candidate has to do, set apart from the scenario above it. */
export function TaskQuestion({ markdown }: { markdown: string }) {
    return (
        <section aria-label="Your task" className="flex flex-col gap-1 pt-2">
            <h2 className="text-[15px] font-semibold text-primary-500">Your task</h2>
            <div className="prose max-w-none text-[15px] leading-relaxed text-neutral-950">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </div>
        </section>
    );
}
