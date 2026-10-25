import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ErrorFallback from "./ErrorFallback"
import { useAuthStore } from "@/features/auth/store/authStore"

const setRole = (role: string | null) =>
    useAuthStore.setState({
        accessToken: role ? "token" : null,
        user: role ? { id: "1", email: "a@b.c", role } : null,
    })

beforeEach(() => setRole(null))

describe("ErrorFallback", () => {
    it("offers Try again, which calls reset", async () => {
        const reset = vi.fn()
        render(<ErrorFallback error={new Error("x")} reset={reset} />)
        await userEvent.click(screen.getByRole("button", { name: "Try again" }))
        expect(reset).toHaveBeenCalledTimes(1)
    })

    it("offers Reload instead of Try again after a stale-bundle error", () => {
        render(
            <ErrorFallback
                error={new Error("Failed to fetch dynamically imported module: https://x/a.js")}
                reset={() => {}}
            />,
        )
        expect(screen.getByRole("button", { name: "Reload page" })).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument()
    })

    it.each([
        [null, "Go to homepage", "/landing"],
        ["EMPLOYER", "Go to my jobs", "/employer/jobs"],
        ["JOB_SEEKER", "Go to the job board", "/job-board"],
        ["ADMIN", "Go to the dashboard", "/admin/dashboard"],
    ])("sends role %s home via a full page load", (role, label, href) => {
        setRole(role)
        render(<ErrorFallback error={new Error("x")} reset={() => {}} />)
        expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href)
    })
})