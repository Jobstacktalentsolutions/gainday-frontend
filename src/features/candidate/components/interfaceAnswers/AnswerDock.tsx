import { createContext, useContext, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

const AnswerTarget = createContext<HTMLElement | null>(null);
export function DockedAnswer({ children }: { children: ReactNode }) {
    const target = useContext(AnswerTarget);
    return target ? createPortal(children, target) : children;
}

const MIN_PERCENT = 25;
const MAX_PERCENT = 75;
const COLLAPSE_THRESHOLD = 15;
const RAIL_WIDTH = 48;

function ExpandIcon({ restore }: { restore: boolean }) {
    return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        {restore ? <path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
    </svg>;
}

export function AnswerDock({ children }: { children: ReactNode }) {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);
    const [leftPercent, setLeftPercent] = useState(55);
    const [dragPercent, setDragPercent] = useState<number | null>(null);
    const [expanded, setExpanded] = useState<"task" | "answer" | null>(null);
    const workspace = useRef<HTMLDivElement | null>(null);
    const dragValue = useRef<number | null>(null);
    const leftId = useId();
    const resize = (next: number) => setLeftPercent(Math.max(MIN_PERCENT, Math.min(MAX_PERCENT, next)));
    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        dragValue.current = leftPercent;
        event.currentTarget.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (dragValue.current === null || !workspace.current) return;
        const bounds = workspace.current.getBoundingClientRect();
        const next = Math.max(4, Math.min(96, ((event.clientX - bounds.left) / bounds.width) * 100));
        dragValue.current = next;
        setDragPercent(next);
    };
    const finishDrag = (cancelled = false) => {
        const value = dragValue.current;
        dragValue.current = null;
        setDragPercent(null);
        if (value === null || cancelled) return;
        if (value <= COLLAPSE_THRESHOLD) setExpanded("answer");
        else if (value >= 100 - COLLAPSE_THRESHOLD) setExpanded("task");
        else resize(value);
    };
    const onResizeKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") resize(leftPercent - 5);
        else if (event.key === "ArrowRight") resize(leftPercent + 5);
        else if (event.key === "Home") setExpanded("answer");
        else if (event.key === "End") setExpanded("task");
        else return;
        event.preventDefault();
    };
    const toggle = (pane: "task" | "answer") => setExpanded(expanded === pane ? null : pane);
    const percent = dragPercent ?? leftPercent;
    const taskRail = expanded === "answer";
    const answerRail = expanded === "task";
    const panelClass = `flex min-w-0 flex-col overflow-hidden lg:min-h-0 ${dragPercent === null ? "transition-[flex-basis] duration-300 ease-out motion-reduce:transition-none" : ""}`;
    return <AnswerTarget.Provider value={target}>
        <div ref={workspace} className="flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:h-[calc(100dvh-5rem)] lg:flex-row">
            <section id={leftId} aria-label="Task" style={{ flexBasis: taskRail ? `${RAIL_WIDTH}px` : answerRail ? `calc(100% - ${RAIL_WIDTH}px)` : `${percent}%` }} className={panelClass}>
                {taskRail && <button type="button" onClick={() => setExpanded(null)} aria-label="Restore task question" className="flex h-full min-h-32 w-full items-center justify-center bg-neutral-50 text-sm font-medium text-neutral-700 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500"><span style={{ writingMode: "vertical-rl" }}>Task question</span></button>}
                <div hidden={taskRail} className={`${taskRail ? "hidden" : "flex"} min-h-0 flex-1 flex-col`}>
                    <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-3"><span className="text-sm font-semibold text-neutral-950">Task</span><button type="button" aria-label={answerRail ? "Restore task and answer" : "Expand task"} title={answerRail ? "Restore panes" : "Expand task"} onClick={() => toggle("task")} className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-primary-500"><ExpandIcon restore={answerRail} /></button></div>
                    <div className="min-h-0 flex-1 overflow-auto p-5 sm:p-6">{children}</div>
                </div>
            </section>
            {!expanded && <div role="separator" aria-label="Resize task and answer" aria-orientation="vertical" aria-controls={leftId} aria-valuemin={MIN_PERCENT} aria-valuemax={MAX_PERCENT} aria-valuenow={Math.round(Math.max(MIN_PERCENT, Math.min(MAX_PERCENT, percent)))} tabIndex={0} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => finishDrag()} onPointerCancel={() => finishDrag(true)} onLostPointerCapture={() => finishDrag(true)} onKeyDown={onResizeKey} className="group hidden w-3 shrink-0 cursor-col-resize touch-none items-center justify-center border-x border-neutral-100 bg-neutral-50 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 lg:flex"><span className="h-10 w-1 rounded-full bg-neutral-300 group-hover:bg-primary-500" /></div>}
            <section aria-label="Answer panel" style={{ flexBasis: answerRail ? `${RAIL_WIDTH}px` : taskRail ? `calc(100% - ${RAIL_WIDTH}px)` : `${100 - percent}%` }} className={`${panelClass} border-t border-neutral-200 lg:border-t-0`}>
                {answerRail && <button type="button" onClick={() => setExpanded(null)} aria-label="Restore task answer" className="flex h-full min-h-32 w-full items-center justify-center bg-neutral-50 text-sm font-medium text-neutral-700 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500"><span style={{ writingMode: "vertical-rl" }}>Task answer</span></button>}
                <div hidden={answerRail} className={`${answerRail ? "hidden" : "flex"} min-h-0 flex-1 flex-col`}>
                    <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-3"><span className="text-sm font-semibold text-neutral-950">Your answer</span><button type="button" aria-label={taskRail ? "Restore task and answer" : "Expand answer"} title={taskRail ? "Restore panes" : "Expand answer"} onClick={() => toggle("answer")} className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-primary-500"><ExpandIcon restore={taskRail} /></button></div>
                    <div ref={setTarget} className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-5 sm:p-6 [&>textarea]:min-h-40 [&>label>textarea]:min-h-40" />
                </div>
            </section>
        </div>
    </AnswerTarget.Provider>;
}
