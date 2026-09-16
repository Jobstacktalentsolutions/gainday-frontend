import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormInput, type FormInputProps } from "@/components/form/FormInput";

export const PasswordInput = forwardRef<HTMLInputElement, Omit<FormInputProps, "type" | "endIcon">>(
    (props, ref) => {
        const [visible, setVisible] = useState(false);
        return (
            <FormInput
                {...props}
                ref={ref}
                type={visible ? "text" : "password"}
                endIcon={
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setVisible((v) => !v)}
                        className="text-neutral-400 hover:text-neutral-600"
                    >
                        {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                }
            />
        )

    }
)