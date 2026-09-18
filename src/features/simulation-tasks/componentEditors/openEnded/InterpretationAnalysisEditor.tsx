import { FormTextarea } from "@/components/form/FormTextarea";
import type { InterpretationAnalysisComponent } from "../../types";

interface Props {
    value: InterpretationAnalysisComponent;
    onChange: (value: InterpretationAnalysisComponent) => void;
}

const InterpretationAnalysisEditor = ({ value, onChange }: Props) => (
    <FormTextarea
        label="Data/scenario the candidate must interpret or analyze"
        rows={3}
        value={value.dataToInterpret}
        onChange={(e) => onChange({ ...value, dataToInterpret: e.target.value })}
    />
);

export default InterpretationAnalysisEditor;
