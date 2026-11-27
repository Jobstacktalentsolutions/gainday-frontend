import { render, screen } from "@testing-library/react";
import ReactMarkdown from "react-markdown";
import { describe, expect, it } from "vitest";
import { MARKDOWN_PLUGINS } from "./markdown";

describe("MARKDOWN_PLUGINS", () => {
    it("keeps a single tilde as text", () => {
        render(<ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS}>{"Sara Lin (~220 employees, three warehouses)."}</ReactMarkdown>);
        expect(screen.getByText(/\(~220 employees, three warehouses\)\./)).toBeInTheDocument();
        expect(document.querySelector("del")).toBeNull();
    });

    it("still strikes through double tildes", () => {
        render(<ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS}>{"~~old~~ new"}</ReactMarkdown>);
        expect(document.querySelector("del")?.textContent).toBe("old");
    });
});
