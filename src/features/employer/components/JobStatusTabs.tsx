import { cn } from "@/lib/utils";
import type { JobStatusFilter } from "../types/job";

const TABS: { value: JobStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "GENERATING", label: "Generating" },
  { value: "ACTIVE", label: "Active" },
  { value: "SHORTLIST_READY", label: "Shortlist ready" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "TERMINATED", label: "Terminated" },
];

interface JobStatusTabsProps {
  value: JobStatusFilter;
  onChange: (value: JobStatusFilter) => void;
}

const JobStatusTabs = ({ value, onChange }: JobStatusTabsProps) => (
  <div
    role="tablist"
    aria-label="Filter jobs by status"
    className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    {TABS.map((tab) => {
      const isActive = tab.value === value;
      return (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.value)}
          className={cn(
            "shrink-0 snap-start whitespace-nowrap rounded-full border border-neutral-100 px-4 py-2 text-base transition-colors",
            isActive ? "bg-neutral-950 text-neutral-50" : "text-neutral-700"
          )}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default JobStatusTabs;