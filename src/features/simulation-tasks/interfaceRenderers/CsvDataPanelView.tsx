import { FormInput } from "@/components/form/FormInput";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { csvToTable } from "../csv";
import type { CsvDataPanelPayload } from "../types";

interface Props {
    payload: CsvDataPanelPayload;
    mode: "preview" | "edit";
    onChange?: (payload: CsvDataPanelPayload) => void;
}

// CSV_DATA_PANEL gives the candidate a data set to read as a table (and download as CSV) before
// answering in writing. Employers see it the way the candidate does, and edit the CSV itself.
const CsvDataPanelView = ({ payload, mode, onChange }: Props) => {
    const { columns, rows } = csvToTable(payload.csv);

    const table = (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((column, index) => (
                        <TableHead key={index}>{column}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    if (mode !== "edit") return table;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">
                    Data (CSV: a header row, then data rows)
                </label>
                <textarea
                    className="min-h-40 w-full rounded-md border border-neutral-200 p-2 font-mono text-sm"
                    value={payload.csv}
                    onChange={(event) => onChange?.({ ...payload, csv: event.target.value })}
                />
                <p className="text-xs text-neutral-500">
                    {rows.length} data {rows.length === 1 ? "row" : "rows"}, {columns.length}{" "}
                    {columns.length === 1 ? "column" : "columns"}. Wrap any field that contains a comma in double quotes.
                </p>
            </div>
            <div className="overflow-x-auto rounded-md border border-neutral-200">{table}</div>
            <FormInput
                label="Candidate answer-box placeholder"
                optional
                value={payload.placeholder ?? ""}
                onChange={(event) => onChange?.({ ...payload, placeholder: event.target.value || null })}
            />
        </div>
    );
};

export default CsvDataPanelView;
