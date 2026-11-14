import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ClassificationAnswer from "./ClassificationAnswer";
import PriorityRankingAnswer from "./PriorityRankingAnswer";
import type { ClassificationCandidateComponent, PriorityRankingCandidateComponent } from "../../types/simulation";

const classification: ClassificationCandidateComponent = { componentType: "CLASSIFICATION", items: ["Alpha", "Bravo"], buckets: ["High", "Medium", "Low"] };
const ranking: PriorityRankingCandidateComponent = { componentType: "PRIORITY_RANKING", items: [{ label: "First", description: "First item" }, { label: "Second", description: "Second item" }] };

describe("structured answer interactions", () => {
    it("moves items between buckets and updates counts using the accessible picker", () => {
        function Harness() {
            const [answer, setAnswer] = useState<Record<string, string>>({});
            return <ClassificationAnswer component={classification} response={answer} onChange={setAnswer} />;
        }
        render(<Harness />);
        fireEvent.change(screen.getByRole("combobox", { name: "Bucket for Alpha" }), { target: { value: "High" } });
        expect(screen.getByLabelText("1 item in High")).toBeInTheDocument();
        expect(within(screen.getByRole("region", { name: "High" })).getByText("Alpha")).toBeInTheDocument();
        fireEvent.change(screen.getByRole("combobox", { name: "Bucket for Alpha" }), { target: { value: "Low" } });
        expect(screen.getByLabelText("0 items in High")).toBeInTheDocument();
        expect(screen.getByLabelText("1 item in Low")).toBeInTheDocument();
    });

    it("reorders the saved ranking and shows the new positions", () => {
        function Harness() {
            const [answer, setAnswer] = useState<number[] | null>(null);
            return <PriorityRankingAnswer component={ranking} response={answer} onChange={setAnswer} />;
        }
        render(<Harness />);
        fireEvent.click(screen.getByRole("button", { name: "Move Second up" }));
        const labels = screen.getAllByText(/^(First|Second)$/).map((element) => element.textContent);
        expect(labels).toEqual(["Second", "First"]);
        expect(screen.getByRole("button", { name: "Move Second up" })).toBeDisabled();
    });
});
