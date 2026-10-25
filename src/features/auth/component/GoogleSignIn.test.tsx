import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { GoogleSignIn } from "./GoogleSignIn"

const mutate = vi.fn()
let clientId: string | undefined = "client-id.apps.googleusercontent.com"
let capturedProps: { onSuccess: (r: { credential?: string }) => void } | null = null

vi.mock("../hooks/useGoogleSignIn", () => ({
    useGoogleSignIn: () => ({ mutate }),
}))

vi.mock("../config/google", () => ({
    get GOOGLE_CLIENT_ID() {
        return clientId
    },
}))

vi.mock("@react-oauth/google", () => ({
    GoogleLogin: (props: { onSuccess: (r: { credential?: string }) => void }) => {
        capturedProps = props
        return <div data-testid="google-login" />
    },
}))

describe("GoogleSignIn", () => {
    beforeEach(() => {
        mutate.mockReset()
        capturedProps = null
        clientId = "client-id.apps.googleusercontent.com"
    })

    it("renders Google's button when a client ID is configured", () => {
        render(<GoogleSignIn redirect={null} />)
        expect(screen.getByTestId("google-login")).toBeTruthy()
    })

    it("renders nothing when no client ID is configured", () => {
        clientId = undefined
        render(<GoogleSignIn redirect={null} />)
        expect(screen.queryByTestId("google-login")).toBeNull()
    })

    it("sends the credential to the backend when Google returns one", () => {
        render(<GoogleSignIn redirect="/job-board" />)
        capturedProps?.onSuccess({ credential: "signed-id-token" })
        expect(mutate).toHaveBeenCalledWith("signed-id-token")
    })

    it("does nothing when Google returns no credential", () => {
        render(<GoogleSignIn redirect={null} />)
        capturedProps?.onSuccess({})
        expect(mutate).not.toHaveBeenCalled()
    })
})
