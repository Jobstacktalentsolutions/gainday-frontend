import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobPagination from "./JobPagination";

describe("JobPagination", () => {
    it("renders nothing when totalPages is 1", () => {
        const { container } = render(
            <JobPagination
                currentPage={1}
                totalPages={1}
                totalItems={5}
                pageSize={9}
                onPageChange={vi.fn()}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders range and navigation controls when totalPages > 1", () => {
        render(
            <JobPagination
                currentPage={1}
                totalPages={2}
                totalItems={18}
                pageSize={9}
                onPageChange={vi.fn()}
            />
        );

        expect(screen.getByText(/showing/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
        expect(screen.getByText("18")).toBeInTheDocument();

        const prevButton = screen.getByRole("button", { name: /previous/i });
        const nextButton = screen.getByRole("button", { name: /next/i });
        expect(prevButton).toBeDisabled();
        expect(nextButton).not.toBeDisabled();
    });

    it("triggers onPageChange when next or page number is clicked", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(
            <JobPagination
                currentPage={1}
                totalPages={3}
                totalItems={25}
                pageSize={9}
                onPageChange={onPageChange}
            />
        );

        const page2Button = screen.getByRole("button", { name: "Page 2" });
        await user.click(page2Button);
        expect(onPageChange).toHaveBeenCalledWith(2);

        const nextButton = screen.getByRole("button", { name: /next/i });
        await user.click(nextButton);
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("disables next button on the last page", () => {
        render(
            <JobPagination
                currentPage={2}
                totalPages={2}
                totalItems={18}
                pageSize={9}
                onPageChange={vi.fn()}
            />
        );

        const prevButton = screen.getByRole("button", { name: /previous/i });
        const nextButton = screen.getByRole("button", { name: /next/i });
        expect(prevButton).not.toBeDisabled();
        expect(nextButton).toBeDisabled();
    });
});
