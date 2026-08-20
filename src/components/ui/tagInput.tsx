import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
}

const TagInput = ({ value, onChange, placeholder, className }: TagInputProps) => {
    const [inputValue, setInputValue] = useState("");

    const addTag = (raw: string) => {
        const tag = raw.trim();
        if (!tag || value.includes(tag)) return;
        onChange([...value, tag]);
        setInputValue("");
    }

    const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    return (
        <div
            className={cn(
                "flex min-h-12 w-full flex-wrap items-center gap-2 rounded-lg border border-neutral-200 px-3.5 py-2.5 shadow-xs",
                className
            )}
        >
            {value.map((tag) => (
                <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-base text-neutral-950"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="cursor-pointer"
                        aria-label={`Remove ${tag}`}>
                        <X className="size-4 text-neutal-700" aria-hidden="true" />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addTag(inputValue)}
                placeholder={value.length === 0 ? placeholder : undefined}
                className="min-w-30 flex-1 bg-transparent text-base text-neutral-950 outline-none placeholder:text-neutral-300"
            />
        </div>
    )
}

export default TagInput;