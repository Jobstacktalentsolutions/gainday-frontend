import { useState } from "react";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { Archive, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import BucketSelect from "./BucketSelect";
import type { ClassificationCandidateComponent } from "../../types/simulation";

interface Props {
    component: ClassificationCandidateComponent;
    response: Record<string, string> | null;
    onChange: (response: Record<string, string>) => void;
    readOnly?: boolean;
}

function Item({ item, buckets, value, onChange, readOnly }: {
    item: string; buckets: string[]; value: string | undefined;
    onChange: (bucket: string) => void; readOnly?: boolean;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `item:${item}`, disabled: readOnly });
    return (
        <div ref={setNodeRef}
            className={cn("flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm", isDragging && "opacity-30")}>
            {!readOnly && <button type="button" {...listeners} {...attributes} aria-label={`Drag ${item}`}
                className="touch-none cursor-grab rounded p-1 text-neutral-400 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-primary-500 active:cursor-grabbing">
                <GripVertical className="size-4" />
            </button>}
            <span className="min-w-0 flex-1 break-words text-sm font-medium text-primary-950">{item}</span>
            {!readOnly && <BucketSelect value={value} buckets={buckets} ariaLabel={`Bucket for ${item}`} onChange={onChange} className="max-w-32" />}
        </div>
    );
}

function Bucket({ name, children, count, readOnly }: { name: string; children: React.ReactNode; count: number; readOnly?: boolean }) {
    const { setNodeRef, isOver } = useDroppable({ id: `bucket:${name}`, disabled: readOnly });
    return (
        <section ref={setNodeRef} aria-label={name} className={cn("min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 p-3 transition-colors", isOver && "border-primary-500 bg-primary-50 ring-2 ring-primary-500/20")}>
            <div className="mb-3 flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-white text-primary-500 shadow-sm"><Archive className="size-4" /></span>
                <h3 className="min-w-0 flex-1 break-words text-sm font-semibold text-primary-950">{name}</h3>
                <span aria-label={`${count} ${count === 1 ? "item" : "items"} in ${name}`} className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-neutral-600">{count}</span>
            </div>
            <div className="flex min-h-16 flex-col gap-2">{children}</div>
        </section>
    );
}

const ClassificationAnswer = ({ component, response, onChange, readOnly }: Props) => {
    const mapping = response ?? {};
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor));
    const unassigned = component.items.filter((item) => !component.buckets.includes(mapping[item]));
    const renderItem = (item: string) => <Item key={item} item={item} buckets={component.buckets} value={mapping[item]} readOnly={readOnly}
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
                {!readOnly && <p className="text-sm text-neutral-600">Drag each item into a bucket, or choose a bucket from the list.</p>}
                {unassigned.length > 0 && <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-neutral-700">Unassigned <span className="text-neutral-500">({unassigned.length})</span></h3>
                    <div className="grid gap-2 sm:grid-cols-2">{unassigned.map(renderItem)}</div>
                </div>}
                <div className="grid gap-3 md:grid-cols-3">
                    {component.buckets.map((bucket) => {
                        const items = component.items.filter((item) => mapping[item] === bucket);
                        return <Bucket key={bucket} name={bucket} count={items.length} readOnly={readOnly}>{items.map(renderItem)}</Bucket>;
                    })}
                </div>
            </div>
            <DragOverlay>{activeItem && <div className="rounded-lg border border-primary-500 bg-white px-4 py-3 text-sm font-medium text-primary-950 shadow-lg">{activeItem}</div>}</DragOverlay>
        </DndContext>
    );
};

export default ClassificationAnswer;
