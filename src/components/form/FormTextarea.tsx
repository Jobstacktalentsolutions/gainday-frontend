import { forwardRef, useState, useId, type TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";


export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    hint?: string;
    hideLabel?: boolean;
    optional?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({
        label,
        error,
        id,
        className,
        hint,
        hideLabel,
        required,
        optional,
        onFocus,
        onBlur,
        ...props
    }, ref) => {

        const [focused, setFocused] = useState(false);
        const generatedId = useId();
        const textareaId = id ?? generatedId;
        const hintId = hint ? `${textareaId}-hint` : undefined;
        const errorId = error ? `${textareaId}-error` : undefined;
        const describedby = [hintId, errorId].filter(Boolean).join(" ") || undefined;
        const hasError = Boolean(error);

    }
)