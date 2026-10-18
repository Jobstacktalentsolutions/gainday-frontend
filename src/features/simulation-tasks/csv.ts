// Parses the CSV carried by a CSV_DATA_PANEL task into a table. Kept in lockstep with
// gainday-backend/src/modules/generation/utils/csv.util.ts, which checks the same CSV is
// well-formed (a header, equal-width rows) before it is ever stored, so this never has to guess.

/** Rows of fields (RFC 4180 style): comma-separated; a field may be wrapped in double quotes to
 *  contain commas, quotes ("" is a literal quote) and line breaks. Blank lines are skipped. */
export function parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let inQuotes = false;

    const endField = () => {
        row.push(field);
        field = "";
    };
    const endRow = () => {
        endField();
        if (row.some((cell) => cell.trim() !== "")) rows.push(row);
        row = [];
    };

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (inQuotes) {
            if (char === '"' && text[i + 1] === '"') {
                field += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                field += char;
            }
        } else if (char === '"') {
            inQuotes = true;
        } else if (char === ",") {
            endField();
        } else if (char === "\n") {
            endRow();
        } else if (char !== "\r") {
            field += char;
        }
    }
    endRow();
    return rows;
}

/** The first row is the header; the rest are data rows. */
export function csvToTable(csv: string): { columns: string[]; rows: string[][] } {
    const [columns = [], ...rows] = parseCsv(csv);
    return { columns, rows };
}

/** Saves the CSV as a file the candidate can open in a spreadsheet. */
export function downloadCsv(csv: string, filename = "data.csv") {
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
