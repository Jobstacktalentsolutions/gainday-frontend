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
                {hint && <p id={hintId} className="text-sm text-neutral-400">{hint}</p>}
                <div
                    className={cn(
                        "group relative flex items-start rounded-lg border bg-white px-3.5 py-2.5 transition-all duration-200",
                        "border-neutral-200",
                        focused && !hasError && "border-primary-500 ring-3 ring-primary-500/20",
                        !focused && !hasError && "hover:bg-neutral-50 hover:border-neutral-300",
                        hasError && "border-error-400 ring-3 ring-error-400/20",
                        className
                    )}
                >

                </div>

            </div>
        );

    }
)