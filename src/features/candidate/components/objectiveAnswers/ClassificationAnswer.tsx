import { useState } from "react";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { Archive } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import BucketSelect from "./BucketSelect";
import type { ClassificationCandidateComponent } from "../../types/simulation";

interface Props {
    component: ClassificationCandidateComponent;
    response: Record<string, string> | null;
    onChange: (response: Record<string, string>) => void;
    readOnly?: boolean;
}

// The whole card is the drag handle. Controls inside it (the unassigned bucket picker) stop their
// pointer and key events from starting a drag.
const stopDragFromControl = { onPointerDown: (e: React.SyntheticEvent) => e.stopPropagation(), onKeyDown: (e: React.SyntheticEvent) => e.stopPropagation() };

function Item({ item, buckets, value, onChange, readOnly, inBucket }: {
    item: string; buckets: string[]; value: string | undefined;
    onChange: (bucket: string) => void; readOnly?: boolean; inBucket?: boolean;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `item:${item}`, disabled: readOnly });
    return (
        <div ref={setNodeRef} {...listeners} {...attributes}
            className={cn("flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-1.5 shadow-sm",
                !readOnly && "cursor-grab touch-none active:cursor-grabbing", isDragging && "opacity-30")}>
            <span className="min-w-0 flex-1 wrap-break-word text-xs font-medium text-primary-950">{item}</span>
            {!readOnly && !inBucket && (
                <span {...stopDragFromControl} className="shrink-0">
                    <BucketSelect value={value} buckets={buckets} ariaLabel={`Bucket for ${item}`} onChange={onChange} className="max-w-28 py-1 text-xs" />
                </span>
            )}
        </div>
    );
}

function Bucket({ name, children, count, readOnly }: { name: string; children: React.ReactNode; count: number; readOnly?: boolean }) {
    const { setNodeRef, isOver } = useDroppable({ id: `bucket:${name}`, disabled: readOnly });
    return (
        <section ref={setNodeRef} aria-label={name} className={cn("min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 p-2 transition-colors", isOver && "border-primary-500 bg-primary-50 ring-2 ring-primary-500/20")}>
            <div className="mb-2 flex items-center gap-1.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white text-primary-500 shadow-sm"><Archive className="size-3" /></span>
                <h3 className="min-w-0 flex-1 wrap-break-word text-xs font-semibold text-primary-950">{name}</h3>
                <span aria-label={`${count} ${count === 1 ? "item" : "items"} in ${name}`} className="rounded-full bg-white px-1.5 py-px text-[10px] font-medium text-neutral-600">{count}</span>
            </div>
            <div className="flex min-h-12 flex-col gap-1.5">{children}</div>
        </section>
    );
}

const ClassificationAnswer = ({ component, response, onChange, readOnly }: Props) => {
    const mapping = response ?? {};
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor));
    const unassigned = component.items.filter((item) => !component.buckets.includes(mapping[item]));
    const renderItem = (item: string, inBucket = false) => <Item key={item} item={item} buckets={component.buckets} value={mapping[item]} readOnly={readOnly} inBucket={inBucket}
        onChange={(bucket) => onChange({ ...mapping, [item]: bucket })} />;
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        setActiveItem(null);
        const item = String(active.id).slice(5);
        const bucket = over ? String(over.id).slice(7) : null;
        if (bucket !== null && component.items.includes(item) && component.buckets.includes(bucket)) {
            onChange({ ...mapping, [item]: bucket });
        }
    };
    return (
        <DndContext sensors={sensors} onDragStart={({ active }) => setActiveItem(String(active.id).slice(5))} onDragEnd={handleDragEnd} onDragCancel={() => setActiveItem(null)}>
            <div className="flex flex-col gap-4">
                {!readOnly && <p className="text-xs text-neutral-600">Drag each item into a bucket, or choose a bucket from the list.</p>}
                {unassigned.length > 0 && <div className="flex flex-col gap-1.5">
                    <h3 className="text-xs font-medium text-neutral-700">Unassigned <span className="text-neutral-500">({unassigned.length})</span></h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-1.5">{unassigned.map((item) => renderItem(item))}</div>
                </div>}
                {/* At most two buckets per row, so the board stays readable and does not crowd. */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {component.buckets.map((bucket) => {
                        const items = component.items.filter((item) => mapping[item] === bucket);
                        return <Bucket key={bucket} name={bucket} count={items.length} readOnly={readOnly}>{items.map((item) => renderItem(item, true))}</Bucket>;
                    })}
                </div>
            </div>
            <DragOverlay>{activeItem && <div className="rounded-lg border border-primary-500 bg-white px-4 py-3 text-sm font-medium text-primary-950 shadow-lg">{activeItem}</div>}</DragOverlay>
        </DndContext>
    );
};

export default ClassificationAnswer;
