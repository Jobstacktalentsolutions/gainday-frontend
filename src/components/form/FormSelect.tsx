import { forwardRef, useState, useId, type SelectHTMLAttributes, type ReactNode } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    hint?: string;
    hideLabel?: boolean;
    optional?: boolean;
    placeholder?: string;
    children: ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
    (
        {
            label,
            error,
            id,
            className,
            hint,
            hideLabel,
            required,
            optional,
            placeholder,
            children,
            onFocus,
            onBlur,
            ...props
        }, ref
    ) => {

        const [focused, setFocused] = useState(false);
        const generatedId = useId();
        const selectId = id ?? generatedId;
        const hintId = hint ? `${selectId}-hint` : undefined;
        const errorId = error ? `${selectId}-error` : undefined;
        const describedby = [hintId, errorId].filter(Boolean).join(" ") || undefined;
        const hasError = Boolean(error);

        return (
            <div className="flex flex-col gap-1.5">
                {
                    !hideLabel && (
                        <label htmlFor={selectId} className="flex items-center gap-1 text-base font-medium text-neutral-800 select-none">
                            {label}
                            {optional && <span className="text-xs font-normal text-neutral-400">(Optional)</span>}
                            {required && <span aria-hidden="true" className="text-error-500">*</span>}
                        </label>
                    )
                }
                {hint && <p id={hintId} className="text-sm text-neutral-400">{hint}</p>}

                <div
                    className={cn(
                        "group relative rounded-lg border bg-neutral-50 px-3.5 py-2.5 transition-all duration-200",
                        "border-neutral-200",
                        focused && !hasError && "border-primary-500 ring-3 ring-primary-500/20",
                        !focused && !hasError && "hover:bg-[#f7f6f6] hover:border-neutral-300",
                        hasError && "border-error-400 ring-3 ring-error-400/20",
                        className
                    )}
                >
                    <select
                        id={selectId}
                        ref={ref}
                        required={required}
                        aria-required={required || undefined}
                        aria-invalid={hasError ? "true" : undefined}
                        aria-describedby={describedby}
                        aria-errormessage={errorId}
                        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
                        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
                        className="w-full appearance-none bg-transparent pr-8 text-base text-neutral-900 outline-none"
                        {...props}
                    >
                        {placeholder && <option value="">{placeholder}</option>}
                        {children}
                    </select>
                    <span className={cn(
                        "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2",
                        hasError ? "text-error-500" : "text-neutral-400"
                    )}>
                        {hasError ? <AlertCircle className="size-5" /> : <ChevronDown className="size-5" />}
                    </span>
                </div>
                {hasError && (
                    <p id={errorId} role="alert" className="text-sm text-error-500">
                        {error}
                    </p>
                )}

            </div>
        );
    }
);

FormSelect.displayName = "FormSelect";