import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InterfaceType } from "@/features/simulation-tasks/types";
import { AnswerDock } from "./AnswerDock";
import { INTERFACE_ANSWER_RENDERERS } from "./registry";

describe("formatted case-file answer", () => {
    it("keeps reference tabs in the task panel and provides a formatting editor in the answer panel", () => {
        const Renderer = INTERFACE_ANSWER_RENDERERS[InterfaceType.CASE_FILE_RICH_TEXT_COMPOSER];
        render(<AnswerDock><Renderer payload={{ interfaceType: InterfaceType.CASE_FILE_RICH_TEXT_COMPOSER, caseFile: { tabs: [{ label: "Policy", content: "Policy reference" }, { label: "Ticket", content: "Ticket reference" }] }, wordLimit: { min: 20, max: 300 }, placeholder: null }} value="" onChange={vi.fn()} /></AnswerDock>);
        expect(screen.getByText("Policy reference")).toBeVisible();
        fireEvent.click(screen.getByRole("tab", { name: "Ticket" }));
        expect(screen.getByText("Ticket reference")).toBeVisible();
        expect(within(screen.getByRole("region", { name: "Answer panel" })).getByRole("button", { name: "Bold" })).toBeVisible();
    });
});
