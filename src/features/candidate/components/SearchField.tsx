import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}


export function SearchField({
  value,
  onChange,
  placeholder = "Search by job title or keyword",
  className,
}: SearchFieldProps) {
  return (
    <div className={cn("flex h-13 w-full items-center gap-3 rounded-full border-[0.5px] border-neutral-300 bg-neutral-50 px-4 sm:w-97", className)}>
      <Search className="size-5 shrink-0 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[16px] text-neutral-700 placeholder:text-neutral-400 outline-none"
      />
    </div>
  );
}