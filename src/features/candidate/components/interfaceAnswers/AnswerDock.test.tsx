import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnswerDock, DockedAnswer } from "./AnswerDock";

describe("task workspace", () => {
    it("preserves an answer when either pane is expanded and restored", () => {
        function Workspace() {
            const [answer, setAnswer] = useState("");
            return <AnswerDock><p>Reference data</p><DockedAnswer><textarea aria-label="Response" value={answer} onChange={(event) => setAnswer(event.target.value)} /></DockedAnswer></AnswerDock>;
        }
        render(<Workspace />);
        fireEvent.change(screen.getByRole("textbox", { name: "Response" }), { target: { value: "My answer" } });
        fireEvent.click(screen.getByRole("button", { name: "Expand task" }));
        fireEvent.click(screen.getByRole("button", { name: "Restore task answer" }));
        expect(screen.getByRole("textbox", { name: "Response" })).toHaveValue("My answer");
        fireEvent.click(screen.getByRole("button", { name: "Expand answer" }));
        fireEvent.click(screen.getByRole("button", { name: "Restore task question" }));
        expect(screen.getByText("Reference data")).toBeVisible();
        expect(screen.getByRole("textbox", { name: "Response" })).toHaveValue("My answer");
    });

    it("resizes panes with the keyboard", () => {
        render(<AnswerDock><DockedAnswer><textarea aria-label="Response" /></DockedAnswer></AnswerDock>);
        const handle = screen.getByRole("separator", { name: "Resize task and answer", hidden: true });
        fireEvent.keyDown(handle, { key: "ArrowRight" });
        expect(handle).toHaveAttribute("aria-valuenow", "60");
        fireEvent.keyDown(handle, { key: "Home" });
        expect(screen.getByRole("button", { name: "Restore task question" })).toBeVisible();
        fireEvent.click(screen.getByRole("button", { name: "Restore task question" }));
    });
});
