import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnswerDock, DockedAnswer } from "./AnswerDock";

describe("answer dock", () => {
    it("keeps the answer when the panel is collapsed and reopened", () => {
        function Workspace() {
            const [answer, setAnswer] = useState("");
            return <AnswerDock question="Explain your choice."><DockedAnswer><textarea aria-label="Response" value={answer} onChange={(event) => setAnswer(event.target.value)} /></DockedAnswer></AnswerDock>;
        }
        render(<Workspace />);
        fireEvent.change(screen.getByRole("textbox", { name: "Response" }), { target: { value: "My answer" } });
        fireEvent.click(screen.getByRole("button", { name: "Collapse answer" }));
        fireEvent.click(screen.getByRole("button", { name: "Expand answer" }));
        expect(screen.getByRole("textbox", { name: "Response" })).toHaveValue("My answer");
        fireEvent.click(screen.getByRole("button", { name: "View question" }));
        expect(screen.getByText("Explain your choice.")).toBeVisible();
    });

    it("resizes with the keyboard within its limits", () => {
        render(<AnswerDock question="Question"><DockedAnswer><textarea aria-label="Response" /></DockedAnswer></AnswerDock>);
        const handle = screen.getByRole("separator", { name: "Resize answer panel" });
        fireEvent.keyDown(handle, { key: "ArrowUp" });
        expect(handle).toHaveAttribute("aria-valuenow", "240");
        fireEvent.keyDown(handle, { key: "Home" });
        expect(handle).toHaveAttribute("aria-valuenow", "140");
    });

    it("opens when the collapsed bar is clicked", () => {
        render(<AnswerDock question="Question"><DockedAnswer><textarea aria-label="Response" /></DockedAnswer></AnswerDock>);
        fireEvent.click(screen.getByRole("button", { name: "Collapse answer" }));
        fireEvent.click(screen.getByText("Your answer"));
        expect(screen.getByRole("textbox", { name: "Response" })).toBeVisible();
    });
});
