import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormInput, type FormInputProps } from "@/components/form/FormInput";
import PasswordChecklist from "./PasswordChecklist";

interface PasswordInputProps extends Omit<FormInputProps, "type" | "endIcon"> {
    showChecklist? : boolean;
}


const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ showChecklist ,value, ...props}, ref) => {

        const [visible, setvisible] = useState(false);
        const [focused, setFocused] = useState(false);


        return (
            <div className = "relative">
                <FormInput
                    ref = { ref }
                    type = { visible ? "text" : "password"}
                    value = { value }
                    onFocus = { () => setFocused(true) }
                    onBlur = { () => setFocused(false) }
                    endIcon = {
                        <button
                            type = "button"
                            tabIndex={-1}
                            onClick = { () => setvisible((v) => !v)}
                            aria-label = { visible ? "Hide password" : "Show password"}
                            className = "text-neutral-500 hover:text-neutral-700"
                        >
                            { visible ?
                            <EyeOff className = "size-5" />
                            : <Eye className=" size-5" />
                        }

                        </button>
                    }
                    { ...props}
                />
                { showChecklist && focused && (
                    <PasswordChecklist value = {(value as string) ?? ""} />
                )}

            </div>
        )
    }
    
)

export default PasswordInput ;
