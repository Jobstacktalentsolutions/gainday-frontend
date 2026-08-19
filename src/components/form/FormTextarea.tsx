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

        return (
            <div className="flex flex-col gap-1.5">
                {!hideLabel && (
                    <label htmlFor={textareaId} className="flex items-center gap-1 text-base font-medium text-neutral-800 select-none">
                        {label}
                        {optional && <span className="text-xs font-normal text-neutral-400">(Optional)</span>}
                        {required && <span aria-hidden="true" className="text-error-500">*</span>}
                    </label>
                )}

            </div>
        );

    }
)