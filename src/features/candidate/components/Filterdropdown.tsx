
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { FilterOption } from "../types/job-board.types";

interface FilterDropdownProps {
  allLabel: string;
  options: FilterOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  className?: string;
}

// NOTE: this assumes shadcn's `dropdown-menu` primitive is already generated
// at `src/components/ui/dropdown-menu.tsx`. If not, run:
//   npx shadcn@latest add dropdown-menu
export function FilterDropdown({
  allLabel,
  options,
  selectedValue,
  onSelect,
  className,
}: FilterDropdownProps) {
  const selectedOption = options.find((option) => option.value === selectedValue);
  const triggerLabel = selectedOption?.label ?? allLabel;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-[52px] shrink-0 items-center justify-center gap-1 rounded-[24px] border border-neutral-200 pl-6 pr-4 py-2 text-[16px] text-neutral-700 outline-none transition-colors hover:border-neutral-300 focus-visible:border-primary-500 data-[state=open]:border-primary-500",
            className,
          )}
        >
          {triggerLabel}
          <ChevronDown className="size-6 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="min-w-[180px] overflow-hidden rounded-xl border-none p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
      >
        <DropdownMenuItem
          onSelect={() => onSelect(null)}
          className={cn(
            "cursor-pointer rounded-none px-3 py-[6px] text-[16px] focus:bg-primary-500 focus:text-neutral-50",
            selectedValue === null ? "bg-primary-500 text-neutral-50" : "text-neutral-700",
          )}
        >
          {allLabel}
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onSelect(option.value)}
            className={cn(
              "cursor-pointer rounded-none px-3 py-[6px] text-[16px] focus:bg-primary-500 focus:text-neutral-50",
              selectedValue === option.value ? "bg-primary-500 text-neutral-50" : "text-neutral-700",
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
