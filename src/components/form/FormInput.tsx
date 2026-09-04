import {
    forwardRef,
    useState,
    useId,
    type InputHTMLAttributes,
    type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";


export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    hint?: string;
    hideLabel?: boolean;
    optional?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}


export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
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
            startIcon,
            endIcon,
            onFocus,
            onBlur,
            ...props
        },
        ref
    ) => {
        const [focused, setFocused] = useState(false);

        // unique IDs to increase accessibility
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const hintId = hint ? `${inputId}-hint` : undefined;
        const errorId = error ? `${inputId}-error` : undefined;

        // aria-describedby should list every applicable description
        const describedby =
            [hintId, errorId].filter(Boolean).join(" ") || undefined;

        const hasError = Boolean(error);

        return (
            <div className="flex flex-col gap-1.5">
                {/* ── Label row ── */}
                {!hideLabel && (
                    <label
                        htmlFor={inputId}
                        className="flex items-center gap-1 text-base font-medium text-neutral-800 select-none"
                    >
                        {label}
                        {optional && (
                            <span className="text-xs font-normal text-neutral-400">
                                (Optional)
                            </span>
                        )}
                        {required && (
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                        )}
                    </label>
                )}

                {/* ── Hint ── */}
                {hint && (
                    <p id={hintId} className="text-sm text-neutral-400">
                        {hint}
                    </p>
                )}

                {/* ── Input wrapper ── */}
                <div
                    className={cn(
                        // base
                        "group relative flex items-center gap-2 rounded-lg border bg-white px-3.5 py-2.5 transition-all duration-200",

                        // State 1 – Default
                        "border-neutral-200",

                        // State 3 – Active / Focus
                        focused && !hasError && "border-primary-500 ring-3 ring-primary-500/20",

                        // State 4 – Hover (only when not focused & no error)
                        !focused && !hasError && "hover:bg-neutral-50 hover:border-neutral-300",

                        // State 5 – Error
                        hasError && "border-error-400 ring-3 ring-error-400/20",

                        className
                    )}
                >
                    {/* Start icon */}
                    {startIcon && (
                        <span className="flex shrink-0 items-center text-neutral-400">
                            {startIcon}
                        </span>
                    )}

                    {/* The actual input */}
                    <input
                        id={inputId}
                        ref={ref}
                        required={required}
                        aria-required={required || undefined}
                        aria-invalid={hasError ? "true" : undefined}
                        aria-describedby={describedby}
                        aria-errormessage={errorId}
                        onFocus={(e) => {
                            setFocused(true);
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setFocused(false);
                            onBlur?.(e);
                        }}
                        className={cn(
                            "min-w-0 flex-1 bg-transparent text-base text-neutral-700 outline-none",
                            "placeholder:text-neutral-400",
                            // State 2 – Filled: text is simply neutral-900 (default above)
                        )}
                        {...props}
                    />

                    {/* End icon — or error icon when in error state */}
                    {hasError ? (
                        <span className="flex shrink-0 items-center text-error-500">
                            <AlertCircle className="size-5" />
                        </span>
                    ) : (
                        endIcon && (
                            <span className="flex shrink-0 items-center text-neutral-400">
                                {endIcon}
                            </span>
                        )
                    )}
                </div>

                {/* ── Error message ── */}
                {hasError && (
                    <p
                        id={errorId}
                        role="alert"
                        className="text-sm text-error-500"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormInput.displayName = "FormInput";