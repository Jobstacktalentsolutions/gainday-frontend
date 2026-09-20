import { forwardRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormInput, type FormInputProps } from "@/components/form/FormInput";
import PasswordChecklist from "@/features/auth/component/PasswordChecklist";

interface PasswordInputProps extends Omit<FormInputProps, "type" | "endIcon"> {
    showChecklist?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ showChecklist, onChange, onFocus, onBlur, ...props }, ref) => {
        const [visible, setVisible] = useState(false);
        const [focused, setFocused] = useState(false);
        const [internalValue, setInternalValue] = useState("");

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            setInternalValue(e.target.value);
            onChange?.(e);
        };

        const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
            setFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
            setFocused(false);
            onBlur?.(e);
        };

        return (
            <div className="relative">
                <FormInput
                    {...props}
                    ref={ref}
                    type={visible ? "text" : "password"}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    endIcon={
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setVisible((v) => !v)}
                            aria-label={visible ? "Hide password" : "Show password"}
                            className="cursor-pointer text-neutral-400 hover:text-neutral-600"
                        >
                            {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                    }
                />
                {showChecklist && focused && (
                    <PasswordChecklist value={internalValue} />
                )}
            </div>
        )
    }
)

PasswordInput.displayName = "PasswordInput";
