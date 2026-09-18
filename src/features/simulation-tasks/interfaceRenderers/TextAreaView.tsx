import { FormInput } from "@/components/form/FormInput";
import type { TextAreaPayload } from "../types";

interface Props {
    payload: TextAreaPayload;
    mode: "preview" | "edit";
    onChange?: (payload: TextAreaPayload) => void;
}

// TEXT_AREA is a plain-text candidate answer box — same shape as RICH_TEXT_COMPOSER (just a
// placeholder), rendered separately so the two interface types can diverge later.
const TextAreaView = ({ payload, mode, onChange }: Props) => {
    if (mode === "edit") {
        return (
            <FormInput
                label="Candidate answer-box placeholder"
                optional
                value={payload.placeholder ?? ""}
                onChange={(e) =>
                    onChange?.({ ...payload, placeholder: e.target.value || null })
                }
            />
        );
    }

    return (
        <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-3 text-sm text-neutral-400">
            Candidate answers here in a plain text area
            {payload.placeholder ? ` — placeholder: "${payload.placeholder}"` : ""}
        </div>
    );
};

export default TextAreaView;
