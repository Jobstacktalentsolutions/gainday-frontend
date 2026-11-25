import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { InterfaceType } from "@/features/simulation-tasks/types";
import type { CandidateSimulationTask } from "../types/simulation";
import { TaskResponseInput } from "./TaskResponseInput";

describe("task answer panel", () => {
    it("keeps ranking controls and their order in the answer panel", () => {
        const task: CandidateSimulationTask = { id: "task", questionBankId: null, taskType: "GENERIC_PRIORITIZE_ITEMS", category: "Engineering", title: "Prioritise", scenarioDescription: "A scenario", questionPrompt: "Rank the items.", objectiveComponent: { componentType: "PRIORITY_RANKING", items: [{ label: "First", description: "First item" }, { label: "Second", description: "Second item" }] }, businessProblemDerived: false, interfaceType: InterfaceType.TEXT_AREA, interfacePayload: { interfaceType: InterfaceType.TEXT_AREA, placeholder: null } };
        function Workspace() {
            const [objective, setObjective] = useState<unknown>(null);
            return <TaskResponseInput task={task} value="" onChange={() => undefined} objectiveResponse={objective} onObjectiveChange={setObjective} onItemReasonsChange={() => undefined} />;
        }
        render(<Workspace />);
        const panel = screen.getByRole("region", { name: "Answer panel" });
        fireEvent.click(within(panel).getByRole("button", { name: "Move Second up" }));
        fireEvent.click(within(panel).getByRole("button", { name: "Collapse answer" }));
        fireEvent.click(within(panel).getByRole("button", { name: "Expand answer" }));
        expect(within(panel).getByRole("button", { name: "Move Second up" })).toBeDisabled();
    });
});
