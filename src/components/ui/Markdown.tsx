import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export interface MarkdownProps {
  children?: string | null;
  content?: string | null;
  className?: string;
  scrollable?: boolean;
}

export const Markdown = ({
  children,
  content,
  className,
  scrollable = false,
}: MarkdownProps) => {
  const text = children ?? content ?? "";

  if (!text || !text.trim()) {
    return null;
  }

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none text-neutral-800 leading-relaxed",
        "prose-headings:font-semibold prose-headings:text-neutral-950 prose-headings:tracking-tight",
        "prose-h1:text-xl prose-h1:my-3",
        "prose-h2:text-lg prose-h2:my-2.5",
        "prose-h3:text-base prose-h3:my-2",
        "prose-p:my-1.5",
        "prose-ul:my-2 prose-ul:list-disc prose-ul:pl-5",
        "prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-5",
        "prose-li:my-0.5",
        "prose-strong:font-semibold prose-strong:text-neutral-950",
        "prose-a:text-primary-600 prose-a:underline hover:prose-a:text-primary-700",
        "prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-xs",
        scrollable && "max-h-64 overflow-y-auto pr-2",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
};

export default Markdown;
