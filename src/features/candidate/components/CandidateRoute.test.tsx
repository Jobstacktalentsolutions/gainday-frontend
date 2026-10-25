import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import CandidateRoute from "./CandidateRoute"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"

vi.mock("@/features/auth/hooks/useCurrentUser", () => ({ useCurrentUser: vi.fn() }))
vi.mock("@/components/ui/AppLoader", () => ({ default: () => <p>LOADING</p> }))

type CurrentUser = ReturnType<typeof useCurrentUser>

const signIn = (state: { role?: string; token?: string | null; loading?: boolean }) => {
    const user = state.role ? { id: "1", email: "a@b.c", role: state.role } : null
    vi.mocked(useCurrentUser).mockReturnValue({
        user,
        accessToken: state.token ?? (user ? "token" : null),
        isAuthenticated: Boolean(user),
        isLoadingProfile: state.loading ?? false,
    } as unknown as CurrentUser)
}

const Where = () => {
    const { pathname, search } = useLocation()
    return <p data-testid="where">{pathname + search}</p>
}

const renderAt = (path: string) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <Where />
            <Routes>
                <Route element={<CandidateRoute />}>
                    <Route path="/candidate/applications" element={<p>PROTECTED</p>} />
                </Route>
                <Route path="*" element={<p>ELSEWHERE</p>} />
            </Routes>
        </MemoryRouter>,
    )

beforeEach(() => signIn({}))

describe("CandidateRoute", () => {
    it("sends signed-out visitors to sign-in, remembering where they were going", () => {
        renderAt("/candidate/applications?tab=active")
        expect(screen.getByTestId("where")).toHaveTextContent(
            "/candidate/signin?redirect=%2Fcandidate%2Fapplications%3Ftab%3Dactive",
        )
    })

    it("lets a signed-in candidate through", () => {
        signIn({ role: "JOB_SEEKER" })
        renderAt("/candidate/applications")
        expect(screen.getByText("PROTECTED")).toBeInTheDocument()
    })

    it("sends employers to their own area", () => {
        signIn({ role: "EMPLOYER" })
        renderAt("/candidate/applications")
        expect(screen.getByTestId("where")).toHaveTextContent("/employer/jobs")
    })

    it("sends any other role to the landing page", () => {
        signIn({ role: "ADMIN" })
        renderAt("/candidate/applications")
        expect(screen.getByTestId("where")).toHaveTextContent("/landing")
    })

    it("shows the loader (not sign-in) while a stored token's profile is loading", () => {
        signIn({ token: "token", loading: true })
        renderAt("/candidate/applications")
        expect(screen.getByText("LOADING")).toBeInTheDocument()
        expect(screen.getByTestId("where")).toHaveTextContent("/candidate/applications")
    })
})