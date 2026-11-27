import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, GripVertical } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { PriorityRankingCandidateComponent } from "../../types/simulation";

const RANKING_LAYOUT_TRANSITION = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

interface Props {
    component: PriorityRankingCandidateComponent;
    response: number[] | null;
    onChange: (response: number[]) => void;
    readOnly?: boolean;
}

function RankingItem({ item, itemIndex, position, total, readOnly, move }: {
    item: PriorityRankingCandidateComponent["items"][number]; itemIndex: number; position: number; total: number;
    readOnly?: boolean; move: (direction: -1 | 1) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: itemIndex, disabled: readOnly });
    // The whole card is the drag surface. A click on a chevron does not start a drag, because the pointer
    // sensor waits for 6px of movement. Keyboard drags start from the card, so the chevrons stop keydown
    // from reaching it.
    // The outer motion.div animates position changes from both the arrows and drags (FLIP via `layout`).
    // dnd-kit owns the inner element's transform, so the two never fight over the same node.
    return (
        <motion.div layout transition={RANKING_LAYOUT_TRANSITION}>
            <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
                {...(readOnly ? {} : { ...attributes, ...listeners, "aria-label": `Drag ${item.label} to reorder` })}
                className={cn("relative flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-4", !readOnly && "touch-none cursor-grab select-none active:cursor-grabbing hover:border-primary-300 focus-visible:outline-2 focus-visible:outline-primary-500", isDragging && "z-10 border-primary-500 shadow-lg")}>
                {!readOnly && <GripVertical aria-hidden="true" className="size-5 shrink-0 text-neutral-400" />}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[16px] text-primary-500">{position + 1}</span>
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[18px] text-primary-950">{item.label}</span>
                    <span className="text-[14px] text-neutral-500">{item.description}</span>
                </div>
                {!readOnly && <div className="flex shrink-0 flex-col gap-1" onKeyDown={(event) => event.stopPropagation()}>
                    <button type="button" aria-label={`Move ${item.label} up`} disabled={position === 0} onClick={() => move(-1)} className="rounded-md border border-neutral-300 text-neutral-950 transition-colors hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-30"><ChevronUp className="size-5" /></button>
                    <button type="button" aria-label={`Move ${item.label} down`} disabled={position === total - 1} onClick={() => move(1)} className="rounded-md border border-neutral-300 text-neutral-950 transition-colors hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-30"><ChevronDown className="size-5" /></button>
                </div>}
            </div>
        </motion.div>
    );
}

const PriorityRankingAnswer = ({ component, response, onChange, readOnly }: Props) => {
    const order = response ?? component.items.map((_, index) => index);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    if (readOnly && response === null) return <p className="text-sm text-neutral-500">No ranking was submitted.</p>;
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (over && active.id !== over.id) onChange(arrayMove(order, order.indexOf(Number(active.id)), order.indexOf(Number(over.id))));
    };
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex w-full flex-col gap-3">
                {!readOnly && <p className="text-sm text-neutral-600">Drag to rank from highest to lowest priority.</p>}
                <SortableContext items={order} strategy={verticalListSortingStrategy}>
                    {order.map((itemIndex, position) => <RankingItem key={itemIndex} item={component.items[itemIndex]} itemIndex={itemIndex} position={position} total={order.length} readOnly={readOnly}
                        move={(direction) => onChange(arrayMove(order, position, position + direction))} />)}
                </SortableContext>
            </div>
        </DndContext>
    );
};

export default PriorityRankingAnswer;
