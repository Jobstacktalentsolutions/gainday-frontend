import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { JobNotFoundState } from "./JobNotFoundState";

const renderState = (props: Parameters<typeof JobNotFoundState>[0] = {}) =>
    render(
        <MemoryRouter>
            <JobNotFoundState {...props} />
        </MemoryRouter>,
    );

describe("JobNotFoundState", () => {
    it("says the job is unavailable and links to the job board", () => {
        renderState();
        expect(screen.getByRole("heading", { name: "This job isn't available" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Browse open roles" })).toHaveAttribute("href", "/job-board");
        expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();
    });

    it("offers a retry when the request failed", () => {
        const onRetry = vi.fn();
        renderState({ variant: "error", onRetry });
        fireEvent.click(screen.getByRole("button", { name: "Try again" }));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("explains a job whose simulation isn't ready", () => {
        renderState({ variant: "noSimulation" });
        expect(screen.getByRole("heading", { name: "This role's simulation isn't ready yet" })).toBeInTheDocument();
    });
});

