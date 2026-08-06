import { Check, X } from "lucide-react";
import { passwordRules } from "../schemas/passwordRules";

interface PasswordChecklistProps {
    value: string;
}

const PasswordChecklist = ({ value }: PasswordChecklistProps) => {

    return (
        <div
            role="status"
            aria-live="polite"
            className="absolute top-full left-1/2 z-10 mt-2 w-68.5 -translate-x-1/2 rounded-sm bg-primary-50/70 p-4 backdrop-blur-[50px]"
        >
            <ul className="flex flex-col gap-1.5">
                {passwordRules.map((rule) => {
                    const passed = rule.test(value);
                    return (
                        <li key={rule.label} className="flex items-center justify-between gap-1 text-base text-neutral-500">
                            <span>{rule.label}</span>
                            {passed ? (
                                <Check className="size-4 shrink-0 text-success-500" aria-label="passed" />
                            ) : (
                                <X className="size-4 shrink-0 text-error-500" aria-label="not passed" />
                            )}
                        </li>
                    )
                })}

            </ul>

        </div>
    );
}

export default PasswordChecklist;