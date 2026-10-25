import { describe, expect, it } from "vitest";
import { describeJournalEntry, describeNumericTable, describeReconciliation } from "./describeAnswers";

describe("describeReconciliation", () => {
    const component = {
        componentType: "RECONCILIATION" as const,
        items: ["Bank charges", "Deposit in transit"],
        sideOptions: [
            { value: "BANK", label: "Adjust bank balance" },
            { value: "BOOK", label: "Adjust cash ledger" },
        ],
        unit: "USD",
    };

    it("names the side chosen for each item and the adjusted balance", () => {
        expect(describeReconciliation(component, { sides: ["BOOK", "BANK"], adjustedBalance: 9500 })).toBe(
            "Bank charges → Adjust cash ledger\nDeposit in transit → Adjust bank balance\nAdjusted cash balance: 9500 USD",
        );
    });

    it("returns nothing for an untouched answer", () => {
        expect(describeReconciliation(component, null)).toBe("");
    });
});

describe("describeJournalEntry", () => {
    const component = {
        componentType: "JOURNAL_ENTRY" as const,
        accounts: ["Cash at bank", "Repairs and maintenance expense"],
        references: ["Office window repair"],
        unit: "USD",
    };

    it("groups lines under the transaction they post", () => {
        expect(
            describeJournalEntry(component, {
                lines: [
                    { reference: "Office window repair", account: "Repairs and maintenance expense", side: "DEBIT", amount: 300 },
                    { reference: "Office window repair", account: "Cash at bank", side: "CREDIT", amount: 300 },
                ],
            }),
        ).toBe("Office window repair: DEBIT Repairs and maintenance expense 300; CREDIT Cash at bank 300");
    });

    it("returns nothing when no lines are entered", () => {
        expect(describeJournalEntry(component, { lines: [] })).toBe("");
    });
});

describe("describeNumericTable", () => {
    const component = {
        componentType: "NUMERIC_TABLE" as const,
        rowLabels: ["Marketing"],
        columnLabels: ["Variance (USD)", "Variance (%)"],
    };

    it("names each figure by its row and column", () => {
        expect(describeNumericTable(component, { values: [[10, null]] })).toBe(
            "Marketing: Variance (USD) 10; Variance (%) not answered",
        );
    });
});
