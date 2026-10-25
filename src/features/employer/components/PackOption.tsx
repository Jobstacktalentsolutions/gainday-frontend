import { cn } from "@/lib/utils";

interface PackOptionProps {
    name: string;
    credits: number;
    priceLabel: string;
    detail: string;
    badge?: string | null;
    selected: boolean;
    disabled?: boolean;
    onSelect: () => void;
}

const PackOption = ({ name, credits, priceLabel, detail, badge, selected, disabled, onSelect }: PackOptionProps) => (
    <button
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={disabled}
        onClick={onSelect}
        className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-primary-200 px-4 py-3 text-left transition-colors",
            selected ? "bg-primary-500/10" : "bg-white/10 hover:bg-primary-50",
            disabled && "cursor-not-allowed opacity-50 hover:bg-white/10",
        )}
    >
        <span className="flex items-center gap-3">
            <span
                aria-hidden="true"
                className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border",
                    selected ? "border-primary-500 bg-primary-500" : "border-neutral-100 bg-white",
                )}
            >
                {selected && <span className="size-2 rounded-full bg-neutral-50" />}
            </span>
            <span className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-base text-black">
                    {name} · {credits} credit{credits === 1 ? "" : "s"}
                    {badge && (
                        <span className="rounded-full bg-success-50 px-2 py-1 text-xs leading-[1.2] text-success-500">
                            {badge}
                        </span>
                    )}
                </span>
                <span className="text-sm leading-[1.2] text-neutral-700">{detail}</span>
            </span>
        </span>
        <span className="shrink-0 text-base text-black">{priceLabel}</span>
    </button>
);

export default PackOption;