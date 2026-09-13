import { Plus, X } from "lucide-react";
import { FormInput } from "@/components/form/FormInput";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import type { TableViewResponsePanelPayload } from "../types";

interface Props {
    payload: TableViewResponsePanelPayload;
    mode: "preview" | "edit";
    onChange?: (payload: TableViewResponsePanelPayload) => void;
}

// TABLE_VIEW_RESPONSE_PANEL shows the candidate a structured table to fill in / respond against —
// the only interface type with real structure beyond a placeholder string.
const TableViewResponsePanelView = ({ payload, mode, onChange }: Props) => {
    const { columns, rows } = payload.table;

    if (mode !== "edit") {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col, i) => (
                            <TableHead key={i}>{col}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, ri) => (
                        <TableRow key={ri}>
                            {row.map((cell, ci) => (
                                <TableCell key={ci}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    const update = (next: Partial<TableViewResponsePanelPayload["table"]>) =>
        onChange?.({ ...payload, table: { ...payload.table, ...next } });

    const setColumn = (index: number, value: string) => {
        const next = [...columns];
        next[index] = value;
        update({ columns: next });
    };

    const addColumn = () => {
        update({
            columns: [...columns, `Column ${columns.length + 1}`],
            rows: rows.map((r) => [...r, ""]),
        });
    };

    const removeColumn = (index: number) => {
        update({
            columns: columns.filter((_, i) => i !== index),
            rows: rows.map((r) => r.filter((_, i) => i !== index)),
        });
    };

    const setCell = (rowIndex: number, colIndex: number, value: string) => {
        const next = rows.map((r) => [...r]);
        next[rowIndex][colIndex] = value;
        update({ rows: next });
    };

    const addRow = () => update({ rows: [...rows, columns.map(() => "")] });

    const removeRow = (index: number) =>
        update({ rows: rows.filter((_, i) => i !== index) });

    return (
        <div className="flex flex-col gap-3">
            <div className="overflow-x-auto rounded-md border border-neutral-200">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            {columns.map((col, ci) => (
                                <th key={ci} className="border-b border-neutral-200 p-2">
                                    <div className="flex items-center gap-1">
                                        <input
                                            className="w-full rounded border border-neutral-200 px-2 py-1 text-sm"
                                            value={col}
                                            onChange={(e) => setColumn(ci, e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeColumn(ci)}
                                            aria-label="Remove column"
                                            className="text-neutral-400 hover:text-error-500"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                </th>
                            ))}
                            <th className="w-8" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, ri) => (
                            <tr key={ri}>
                                {row.map((cell, ci) => (
                                    <td key={ci} className="border-b border-neutral-100 p-2">
                                        <input
                                            className="w-full rounded border border-neutral-200 px-2 py-1 text-sm"
                                            value={cell}
                                            onChange={(e) => setCell(ri, ci, e.target.value)}
                                        />
                                    </td>
                                ))}
                                <td className="border-b border-neutral-100 p-2">
                                    <button
                                        type="button"
                                        onClick={() => removeRow(ri)}
                                        aria-label="Remove row"
                                        className="text-neutral-400 hover:text-error-500"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={addColumn}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                    <Plus className="size-3.5" /> Column
                </button>
                <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                    <Plus className="size-3.5" /> Row
                </button>
            </div>
            <FormInput
                label="Candidate answer-box placeholder"
                optional
                value={payload.placeholder ?? ""}
                onChange={(e) =>
                    onChange?.({ ...payload, placeholder: e.target.value || null })
                }
            />
        </div>
    );
};

export default TableViewResponsePanelView;
