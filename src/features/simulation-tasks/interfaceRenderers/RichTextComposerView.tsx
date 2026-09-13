import { FormInput } from "@/components/form/FormInput";
import type { RichTextComposerPayload } from "../types";

interface Props {
    payload: RichTextComposerPayload;
    mode: "preview" | "edit";
    onChange?: (payload: RichTextComposerPayload) => void;
}

// RICH_TEXT_COMPOSER only carries a placeholder for the candidate's own rich-text answer box —
// there's nothing else to render/edit here.
const RichTextComposerView = ({ payload, mode, onChange }: Props) => {
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
            Candidate answers here in a rich-text editor
            {payload.placeholder ? ` — placeholder: "${payload.placeholder}"` : ""}
        </div>
    );
};

export default RichTextComposerView;
