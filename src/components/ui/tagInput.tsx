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

    }

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