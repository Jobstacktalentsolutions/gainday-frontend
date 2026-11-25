import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InterfaceType } from "@/features/simulation-tasks/types";
import TableViewResponsePanelAnswer from "./TableViewResponsePanelAnswer";
import type { ClassificationCandidateComponent } from "../../types/simulation";

describe("table classification", () => {
    it("records and displays a selection alongside the matching row", () => {
        const component: ClassificationCandidateComponent = { componentType: "CLASSIFICATION", items: ["A", "B"], buckets: ["Review", "Accept"] };
        function Example() {
            const [response, setResponse] = useState<Record<string, string>>({});
            return <TableViewResponsePanelAnswer payload={{ interfaceType: InterfaceType.TABLE_VIEW_RESPONSE_PANEL, table: { columns: ["Item"], rows: [["A"], ["B"]] }, placeholder: null }} value="" onChange={() => undefined} classification={{ component, response, onChange: setResponse }} />;
        }
        render(<Example />);
        const choice = screen.getByRole("combobox", { name: "Classification for A" });
        fireEvent.change(choice, { target: { value: "Review" } });
        expect(choice).toHaveValue("Review");
    });
});
