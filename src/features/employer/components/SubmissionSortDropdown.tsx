import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { SortConfig } from "../utils/submissionSort";
import type { SortDirection } from "../types/submission";

interface SubmissionSortDropdownProps {
    config: SortConfig;
    /** The direction currently applied through this dropdown, or null when another sort is active. */
    activeDirection: SortDirection | null;
    onSelect: (direction: SortDirection) => void;
}

// Same pill styling as the candidate job board's FilterDropdown, but a sort has no "All" option —
// it's always one of two directions.
const SubmissionSortDropdown = ({ config, activeDirection, onSelect }: SubmissionSortDropdownProps) => {
    const activeOption = config.options.find((option) => option.direction === activeDirection);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    "flex h-13 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[24px] border border-neutral-200 py-2 pl-6 pr-4 text-[16px] text-neutral-700 outline-none transition-colors hover:border-neutral-300 focus-visible:border-primary-500 data-popup-open:border-primary-500",
                    activeOption && "border-primary-500",
                )}
            >
                {activeOption ? `${config.label}: ${activeOption.label}` : config.label}
                <ChevronDown className="size-6 shrink-0" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="min-w-45 overflow-hidden rounded-xl border-none p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            >
                {config.options.map((option) => (
                    <DropdownMenuItem
                        key={option.direction}
                        onClick={() => onSelect(option.direction)}
                        className={cn(
                            "cursor-pointer rounded-none px-3 py-1.5 text-[16px] focus:bg-primary-500 focus:text-neutral-50",
                            activeDirection === option.direction ? "bg-primary-500 text-neutral-50" : "text-neutral-700",
                        )}
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SubmissionSortDropdown;