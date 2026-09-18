import { FormTextarea } from "@/components/form/FormTextarea";
import type { StakeholderPushbackResponseComponent } from "../../types";

interface Props {
    value: StakeholderPushbackResponseComponent;
    onChange: (value: StakeholderPushbackResponseComponent) => void;
}

const StakeholderPushbackResponseEditor = ({ value, onChange }: Props) => (
    <FormTextarea
        label="Stakeholder pushback/objection the candidate must respond to"
        rows={3}
        value={value.pushbackStatement}
        onChange={(e) =>
            onChange({ ...value, pushbackStatement: e.target.value })
        }
    />
);

export default StakeholderPushbackResponseEditor;
