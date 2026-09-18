import { FormTextarea } from "@/components/form/FormTextarea";
import type { WrittenJustificationComponent } from "../../types";

interface Props {
    value: WrittenJustificationComponent;
    onChange: (value: WrittenJustificationComponent) => void;
}

const WrittenJustificationEditor = ({ value, onChange }: Props) => (
    <FormTextarea
        label="Decision the candidate must justify in writing"
        rows={3}
        value={value.decisionAlreadyMade}
        onChange={(e) =>
            onChange({ ...value, decisionAlreadyMade: e.target.value })
        }
    />
);

export default WrittenJustificationEditor;
