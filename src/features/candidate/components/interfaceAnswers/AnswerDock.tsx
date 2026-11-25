import { createContext, useContext, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronUp, FileText } from "@/components/ui/icons";

const DockTarget = createContext<HTMLElement | null>(null);

/** Render once: the same editor moves into the dock without duplicating its state. */
export function DockedAnswer({ children }: { children: ReactNode }) {
    const target = useContext(DockTarget);
    return target ? createPortal(children, target) : children;
}

export function AnswerDock({ question, children }: { question: string; children: ReactNode }) {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    const [expanded, setExpanded] = useState(true);
    const [showQuestion, setShowQuestion] = useState(false);
    const [height, setHeight] = useState(220);
    const panelId = useId();
    const dockRef = useRef<HTMLElement | null>(null);
    const drag = useRef<{ startY: number; startHeight: number } | null>(null);
    useLayoutEffect(() => {
        const dock = dockRef.current;
        const main = dock?.closest("main");
        if (!dock || !main) return;
        const update = () => main.style.setProperty("--answer-dock-height", `${dock.getBoundingClientRect().height}px`);
        update();
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
        observer?.observe(dock);
        return () => {
            observer?.disconnect();
            main.style.removeProperty("--answer-dock-height");
        };
    }, [expanded, height, showQuestion]);
    const maxHeight = () => Math.max(140, Math.min(560, window.innerHeight - 220));
    const resize = (next: number) => setHeight(Math.max(140, Math.min(maxHeight(), next)));
    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (!expanded || event.button !== 0) return;
        drag.current = { startY: event.clientY, startHeight: height };
        event.currentTarget.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (drag.current) resize(drag.current.startHeight + drag.current.startY - event.clientY);
    };
    const onResizeKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowUp") resize(height + 20);
        else if (event.key === "ArrowDown") resize(height - 20);
        else if (event.key === "Home") resize(140);
        else if (event.key === "End") resize(maxHeight());
        else return;
        event.preventDefault();
    };
    return <DockTarget.Provider value={target}>
        {children}
        <section ref={dockRef} aria-label="Answer panel" onClick={() => { if (!expanded) setExpanded(true); }} className={`fixed inset-x-0 bottom-0 z-20 border-t border-neutral-200 bg-white shadow-[0_-8px_24px_rgba(16,24,40,0.10)] ${expanded ? "" : "cursor-pointer"}`}>
            {expanded && <div role="separator" tabIndex={0} aria-label="Resize answer panel" aria-orientation="horizontal" aria-controls={panelId} aria-valuemin={140} aria-valuemax={typeof window === "undefined" ? 560 : maxHeight()} aria-valuenow={height}
                onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} onKeyDown={onResizeKey}
                className="group flex h-4 cursor-ns-resize touch-none items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500">
                <span className="h-1 w-12 rounded-full bg-neutral-300 transition-colors group-hover:bg-primary-500 group-focus-visible:bg-primary-500" />
            </div>}
            <div className="mx-auto max-w-300 px-4 sm:px-6">
                <div className="flex items-center justify-between gap-3 pb-2 pt-1">
                    <span className="text-sm font-semibold text-neutral-950">Your answer</span>
                    <div className="flex items-center gap-2">
                        <button type="button" aria-expanded={showQuestion} onClick={() => setShowQuestion(!showQuestion)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500"><FileText className="size-4" aria-hidden="true" />{showQuestion ? "Hide question" : "View question"}</button>
                        <button type="button" aria-label={expanded ? "Collapse answer" : "Expand answer"} title={expanded ? "Collapse answer" : "Expand answer"} aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded(!expanded)} className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-primary-500">{expanded ? <ChevronDown className="size-4" aria-hidden="true" /> : <ChevronUp className="size-4" aria-hidden="true" />}</button>
                    </div>
                </div>
                {showQuestion && <div className="prose max-h-[25vh] max-w-none overflow-y-auto border-t border-neutral-200 py-3 text-sm"><ReactMarkdown remarkPlugins={[remarkGfm]}>{question}</ReactMarkdown></div>}
                <div id={panelId} ref={setTarget} hidden={!expanded} style={{ height: expanded ? height : undefined }} className={`${expanded ? "flex" : "hidden"} max-h-[calc(100dvh-220px)] flex-col gap-2 overflow-y-auto pb-3 [&>textarea]:min-h-0 [&>textarea]:flex-1 [&>label]:min-h-0 [&>label]:flex-1 [&>label>textarea]:min-h-0 [&>label>textarea]:flex-1`} />
            </div>
        </section>
    </DockTarget.Provider>;
}
