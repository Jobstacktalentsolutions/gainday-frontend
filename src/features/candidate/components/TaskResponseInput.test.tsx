import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { InterfaceType } from "@/features/simulation-tasks/types";
import type { CandidateSimulationTask } from "../types/simulation";
import { TaskResponseInput } from "./TaskResponseInput";
import { AnswerDock } from "./interfaceAnswers/AnswerDock";

describe("task answer panel", () => {
    it("keeps ranking controls and their order in the answer panel", () => {
        const task: CandidateSimulationTask = { id: "task", questionBankId: null, taskType: "GENERIC_PRIORITIZE_ITEMS", category: "Engineering", title: "Prioritise", scenarioDescription: "A scenario", questionPrompt: "Rank the items.", objectiveComponent: { componentType: "PRIORITY_RANKING", items: [{ label: "First", description: "First item" }, { label: "Second", description: "Second item" }] }, businessProblemDerived: false, interfaceType: InterfaceType.TEXT_AREA, interfacePayload: { interfaceType: InterfaceType.TEXT_AREA, placeholder: null } };
        function Workspace() {
            const [objective, setObjective] = useState<unknown>(null);
            return <AnswerDock><TaskResponseInput task={task} value="" onChange={() => undefined} objectiveResponse={objective} onObjectiveChange={setObjective} onItemReasonsChange={() => undefined} /></AnswerDock>;
        }
        render(<Workspace />);
        const panel = screen.getByRole("region", { name: "Answer panel" });
        const written = within(panel).getByPlaceholderText("Type your response here...");
        expect(within(written.parentElement as HTMLElement).getByText("0 / 250 words")).toBeInTheDocument();
        fireEvent.click(within(panel).getByRole("button", { name: "Move Second up" }));
        fireEvent.click(within(panel).getByRole("button", { name: "Expand answer" }));
        fireEvent.click(within(panel).getByRole("button", { name: "Restore task and answer" }));
        expect(within(panel).getByRole("button", { name: "Move Second up" })).toBeDisabled();
    });
});
