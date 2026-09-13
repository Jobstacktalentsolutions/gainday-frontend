import { forwardRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormInput, type FormInputProps } from "@/components/form/FormInput";
import PasswordChecklist from "./PasswordChecklist";

interface PasswordInputProps extends Omit<FormInputProps, "type" | "endIcon"> {
    showChecklist?: boolean;
}


const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ showChecklist, onChange, onFocus, onBlur, ...props }, ref) => {

        const [visible, setvisible] = useState(false);
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
                    ref={ref}
                    type={visible ? "text" : "password"}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    endIcon={
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setvisible((v) => !v)}
                            aria-label={visible ? "Hide password" : "Show password"}
                            className="text-neutral-300 hover:text-neutral-500 cursor-pointer"
                        >
                            {visible ?
                                <EyeOff className="size-5" />
                                : <Eye className=" size-5" />
                            }

                        </button>
                    }
                    {...props}
                />
                {showChecklist && focused && (
                    <PasswordChecklist value={internalValue} />
                )}

            </div>
        )
    }

)

export default PasswordInput;

PasswordInput.displayName = "PasswordInput";
