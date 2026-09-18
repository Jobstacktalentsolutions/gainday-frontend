import { FormInput } from "@/components/form/FormInput";
import type { DraftedCommunicationComponent } from "../../types";

interface Props {
    value: DraftedCommunicationComponent;
    onChange: (value: DraftedCommunicationComponent) => void;
}

const DraftedCommunicationEditor = ({ value, onChange }: Props) => (
    <div className="grid grid-cols-2 gap-3">
        <FormInput
            label="Recipient"
            value={value.recipient}
            onChange={(e) => onChange({ ...value, recipient: e.target.value })}
        />
        <FormInput
            label="Goal"
            value={value.goal}
            onChange={(e) => onChange({ ...value, goal: e.target.value })}
        />
    </div>
);

export default DraftedCommunicationEditor;
