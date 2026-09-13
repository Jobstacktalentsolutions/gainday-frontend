import { FormInput } from "@/components/form/FormInput";
import type { NumericInputComponent } from "../../types";

interface Props {
    value: NumericInputComponent;
    onChange: (value: NumericInputComponent) => void;
}

const NumericInputEditor = ({ value, onChange }: Props) => (
    <div className="grid grid-cols-3 gap-3">
        <FormInput
            label="Correct value"
            type="number"
            value={value.correctValue}
            onChange={(e) =>
                onChange({ ...value, correctValue: Number(e.target.value) })
            }
        />
        <FormInput
            label="Tolerance (+/-)"
            type="number"
            value={value.tolerance}
            onChange={(e) =>
                onChange({ ...value, tolerance: Number(e.target.value) })
            }
        />
        <FormInput
            label="Unit"
            optional
            value={value.unit ?? ""}
            onChange={(e) => onChange({ ...value, unit: e.target.value || null })}
        />
    </div>
);

export default NumericInputEditor;
