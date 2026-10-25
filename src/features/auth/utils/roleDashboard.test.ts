import { describe, expect, it } from "vitest"
import { resolvePostLoginPath } from "./roleDashboard"

describe("resolvePostLoginPath", () => {
    it("sends each role to its own dashboard when there is no redirect", () => {
        expect(resolvePostLoginPath("EMPLOYER", null)).toBe("/employer/jobs")
        expect(resolvePostLoginPath("JOB_SEEKER", null)).toBe("/job-board")
        expect(resolvePostLoginPath("ADMIN", null)).toBe("/admin/overview")
    })

    it("uses a redirect that is inside the role's own area", () => {
        expect(resolvePostLoginPath("EMPLOYER", "/employer/submissions/1")).toBe("/employer/submissions/1")
        expect(resolvePostLoginPath("JOB_SEEKER", "/job-board/abc/simulation")).toBe("/job-board/abc/simulation")
    })

    it("ignores a redirect that belongs to a different role, so the guards never bounce them", () => {
        expect(resolvePostLoginPath("JOB_SEEKER", "/employer/jobs")).toBe("/job-board")
        expect(resolvePostLoginPath("EMPLOYER", "/job-board")).toBe("/employer/jobs")
    })

    it("ignores a redirect that is off-site or only shares a prefix", () => {
        expect(resolvePostLoginPath("EMPLOYER", "https://evil.example")).toBe("/employer/jobs")
        expect(resolvePostLoginPath("EMPLOYER", "//evil.example/employer")).toBe("/employer/jobs")
        expect(resolvePostLoginPath("EMPLOYER", "/employerx")).toBe("/employer/jobs")
    })

    it("falls back to the landing page for an unknown role", () => {
        expect(resolvePostLoginPath("GUEST", null)).toBe("/landing")
    })
})
