import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
    value : string[];
    onChange : (tags : string[]) => void;
    placeholder? : string;
    className?: string;
}

const TagInput = ({ value, onChange, placeholder, className} : TagInputProps) => {
    const [inputValue, setInputValue] = useState("");

    const addTag = (raw : string ) => {
        const tag = raw.trim();
        if (!tag || value.includes(tag)) return;
        onChange([...value, tag]);
        setInputValue("");
    }

    const removeTag = (tag : string) => onChange(value.filter((t) => t == tag));

    const handleKeyDown = (e : KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    return (
        <div>
            {value.map((tag) => (
                <span>

                </span>
            ))}

        </div>
    )
}

export default TagInput;