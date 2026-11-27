import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { JobFormInput } from "./JobFormInput";
import { formatSalaryInput, parseSalaryInput } from "@/lib/formatSalary";

interface SalaryFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    error?: string;
}

// Comma-grouped pound input. The form stores a plain number; commas exist only on screen.
export const SalaryField = <T extends FieldValues>({ control, name, label, error }: SalaryFieldProps<T>) => (
    <Controller
        control={control}
        name={name}
        render={({ field }) => (
            <JobFormInput
                ref={field.ref}
                name={field.name}
                label={label}
                inputMode="numeric"
                startIcon={<span>£</span>}
                error={error}
                value={formatSalaryInput(field.value)}
                onChange={(e) => field.onChange(parseSalaryInput(e.target.value))}
                onBlur={field.onBlur}
            />
        )}
    />
);
