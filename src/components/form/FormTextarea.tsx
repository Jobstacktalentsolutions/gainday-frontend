import { forwardRef, useState, useId, useCallback, useEffect, useRef, type TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";


export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    hint?: string;
    hideLabel?: boolean;
    optional?: boolean;
    /** When true the textarea auto-grows to fit all content (no scroll). */
    autoSize?: boolean;
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
        autoSize,
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

        // ── Auto-size logic ──
        const internalRef = useRef<HTMLTextAreaElement | null>(null);
        const prevValueRef = useRef<string>("");

        const resize = useCallback(() => {
            const el = internalRef.current;
            if (!el || !autoSize) return;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }, [autoSize]);

        // Poll for programmatic value changes (setValue / replace) that bypass onChange
        useEffect(() => {
            if (!autoSize) return;
            const interval = setInterval(() => {
                const el = internalRef.current;
                if (!el) return;
                if (el.value !== prevValueRef.current) {
                    prevValueRef.current = el.value;
                    resize();
                }
            }, 150);
            return () => clearInterval(interval);
        }, [autoSize, resize]);

        // Merge forwarded ref with internal ref
        const setRefs = useCallback(
            (node: HTMLTextAreaElement | null) => {
                internalRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
                // Initial size — defer so RHF has time to set the value
                if (node && autoSize) {
                    requestAnimationFrame(() => {
                        prevValueRef.current = node.value;
                        node.style.height = "auto";
                        node.style.height = `${node.scrollHeight}px`;
                    });
                }
            },
            [ref, autoSize]
        );

        // Destructure onChange from rest props so we can wrap it with resize
        const { onChange: onChangeProp, ...restProps } = props;

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
                    <textarea
                        id={textareaId}
                        ref={setRefs}
                        required={required}
                        aria-required={required || undefined}
                        aria-invalid={hasError ? "true" : undefined}
                        aria-describedby={describedby}
                        aria-errormessage={errorId}
                        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
                        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
                        onChange={(e) => {
                            onChangeProp?.(e);
                            if (autoSize) {
                                prevValueRef.current = e.target.value;
                                resize();
                            }
                        }}
                        className={cn(
                            "min-w-0 flex-1 resize-none bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-400 scrollbar-modern",
                            autoSize && "overflow-hidden"
                        )}
                        {...restProps}
                    />
                    {hasError && (
                        <span className="flex shrink-0 items-center text-error-500">
                            <AlertCircle className="size-5" />
                        </span>
                    )}

                </div>
                {hasError && (
                    <p id={errorId} role="alert" className="text-sm text-error-500">
                        {error}
                    </p>
                )}

            </div>
        );

    }
)
FormTextarea.displayName = "FormTextarea";