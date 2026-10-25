import type { MouseEvent } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToSectionById } from "@/features/landing/utils/scrollToSection";

export interface TocItem {
    id: string;
    label?: string;
    title: string;
}

interface LegalTocProps {
    items: TocItem[];
    activeId: string | null;
}

const TocLinks = ({
    items,
    activeId,
    onNavigate,
}: LegalTocProps & { onNavigate?: (e: MouseEvent<HTMLAnchorElement>) => void }) => (
    <ol className="flex flex-col">
        {items.map((item) => {
            const active = item.id === activeId;
            return (
                <li key={item.id}>
                    <a
                        href={`#${item.id}`}
                        aria-current={active ? "location" : undefined}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSectionById(item.id);
                            window.history.replaceState(null, "", `#${item.id}`);
                            onNavigate?.(e);
                        }}
                        className={cn(
                            "flex items-baseline gap-3 border-l-2 py-1.5 pl-4 text-sm transition-colors",
                            active
                                ? "border-primary-500 font-medium text-primary-600"
                                : "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-primary-500",
                        )}
                    >
                        {item.label && (
                            <span className="w-7 shrink-0 text-xs tabular-nums text-neutral-400">{item.label}</span>
                        )}
                        <span>{item.title}</span>
                    </a>
                </li>
            );
        })}
    </ol>
);

export const LegalToc = ({ items, activeId }: LegalTocProps) => (
    <>
        {/* Mobile: native disclosure, no JS state */}
        <details className="group rounded-2xl border border-neutral-200/80 bg-white lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                On this page
                <ChevronDown
                    className="size-4 text-neutral-500 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                />
            </summary>
            <nav aria-label="On this page" className="border-t border-neutral-200/80 px-5 py-4">
                <TocLinks
                    items={items}
                    activeId={activeId}
                    onNavigate={(e) => e.currentTarget.closest("details")?.removeAttribute("open")}
                />
            </nav>
        </details>

        {/* Desktop: sticky rail */}
        <nav
            aria-label="On this page"
            className="sticky top-32 hidden max-h-[calc(100vh-10rem)] overflow-y-auto lg:block"
        >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">On this page</p>
            <TocLinks items={items} activeId={activeId} />
        </nav>
    </>
);