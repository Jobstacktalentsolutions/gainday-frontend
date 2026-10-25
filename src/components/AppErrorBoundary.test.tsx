import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AppErrorBoundary from "./AppErrorBoundary"
import { reportError } from "@/lib/reportError"

vi.mock("@/lib/reportError", () => ({ reportError: vi.fn() }))

let shouldThrow = true
const Bomb = () => {
    if (shouldThrow) throw new Error("boom")
    return <p>all good</p>
}

const fallback = ({ error, reset }: { error: Error; reset: () => void }) => (
    <div>
        <p>caught: {error.message}</p>
        <button onClick={reset}>retry</button>
    </div>
)

beforeEach(() => {
    shouldThrow = true
    // React logs every caught render error; keep the test output readable.
    vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("AppErrorBoundary", () => {
    it("renders its children when nothing throws", () => {
        shouldThrow = false
        render(
            <AppErrorBoundary renderFallback={fallback}>
                <Bomb />
            </AppErrorBoundary>,
        )
        expect(screen.getByText("all good")).toBeInTheDocument()
    })

    it("shows the fallback and reports the error when a child throws", () => {
        render(
            <AppErrorBoundary renderFallback={fallback}>
                <Bomb />
            </AppErrorBoundary>,
        )
        expect(screen.getByText("caught: boom")).toBeInTheDocument()
        expect(reportError).toHaveBeenCalledTimes(1)
        expect(vi.mocked(reportError).mock.calls[0][0]).toBeInstanceOf(Error)
    })

    it("recovers when reset is called and the problem is gone", async () => {
        render(
            <AppErrorBoundary renderFallback={fallback}>
                <Bomb />
            </AppErrorBoundary>,
        )
        shouldThrow = false
        await userEvent.click(screen.getByRole("button", { name: "retry" }))
        expect(screen.getByText("all good")).toBeInTheDocument()
    })

    it("clears the error when resetKey changes (the user navigated away)", () => {
        const { rerender } = render(
            <AppErrorBoundary resetKey="/a" renderFallback={fallback}>
                <Bomb />
            </AppErrorBoundary>,
        )
        expect(screen.getByText("caught: boom")).toBeInTheDocument()

        shouldThrow = false
        rerender(
            <AppErrorBoundary resetKey="/b" renderFallback={fallback}>
                <Bomb />
            </AppErrorBoundary>,
        )
        expect(screen.getByText("all good")).toBeInTheDocument()
    })
})