import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ReplyBox from "./ReplyBox";

function Harness({ maxWords, onSend }: { maxWords: number; onSend: () => void }) {
    const [value, setValue] = useState("");
    return (
        <ReplyBox
            value={value}
            onChange={setValue}
            onSend={onSend}
            maxWords={maxWords}
            disabled={false}
            placeholder={null}
        />
    );
}

describe("ReplyBox", () => {
    it("stops the reply at the word limit and shows the count in red", () => {
        render(<Harness maxWords={2} onSend={vi.fn()} />);
        const box = screen.getByRole("textbox", { name: "Your reply" });

        fireEvent.change(box, { target: { value: "one two three" } });

        expect(box).toHaveValue("one two");
        expect(screen.getByText("2 / 2 words")).toHaveClass("text-error-600");
        expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
    });

    it("sends on Ctrl+Enter when the reply is within the limit", () => {
        const onSend = vi.fn();
        render(<Harness maxWords={10} onSend={onSend} />);
        const box = screen.getByRole("textbox", { name: "Your reply" });

        fireEvent.change(box, { target: { value: "Sorry about the delay." } });
        fireEvent.keyDown(box, { key: "Enter", ctrlKey: false, metaKey: false });
        expect(onSend).not.toHaveBeenCalled();

        fireEvent.keyDown(box, { key: "Enter", ctrlKey: true, metaKey: false });
        expect(onSend).toHaveBeenCalledTimes(1);
    });

});
