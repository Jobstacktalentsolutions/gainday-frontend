import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";


export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    hint?: string;
    hideLabel?: boolean;
    endIcon?: ReactNode;
}


export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, id, className, hint, hideLabel, required, endIcon, ...props }, ref) => {

        //unique IDs to increase accessibility
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const hintId = hint ? `${inputId}-hint` : undefined;
        const errorId = error ? `${inputId}-error` : undefined;

        //aria-describedby should list every applicable description
        const describedby = [hintId, errorId].filter(Boolean).join(" ") || undefined;

        return (
            <div className="space-y-2">
                <Label htmlFor={inputId} className={cn(hideLabel && "sr-only")}>
                    {label}
                    {required && (
                        <span aria-hidden="true" className="ml-0.5 text-destructive">
                            *
                        </span>
                    )}
                </Label>
                {hint && (
                    <p id={hintId} className="text-sm text-muted-foreground">
                        {hint}
                    </p>
                )}

                <Input
                    id={inputId}
                    ref={ref}
                    required={required}
                    aria-required={required || undefined}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={describedby}
                    aria-errormessage={errorId}
                    className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
                    {...props}
                />
                {
                    endIcon && (
                        <div className="absolute top-1/2 rigt-3 -translate-y-1/2">
                            {endIcon}
                        </div>
                    )
                }

                {error && (
                    <p id={errorId}
                        role="alert"
                        className="flex items-center gap-1.5 text-sm text-destructive">
                        <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                        {error}
                    </p>
                )}

            </div>
        );
    }
)

FormInput.displayName = "FormInput"