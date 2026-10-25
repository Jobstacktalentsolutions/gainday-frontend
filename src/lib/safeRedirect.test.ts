import { describe, expect, it } from "vitest"
import { toSafeRedirect, withRedirect } from "./safeRedirect"

describe("toSafeRedirect", () => {
    it("keeps a same-site path, including its query", () => {
        expect(toSafeRedirect("/employer/billing?buy=GROWTH")).toBe("/employer/billing?buy=GROWTH")
    })

    it("drops anything that could leave the site", () => {
        expect(toSafeRedirect("https://evil.example")).toBeNull()
        expect(toSafeRedirect("//evil.example")).toBeNull()
        expect(toSafeRedirect("employer/billing")).toBeNull()
        expect(toSafeRedirect(null)).toBeNull()
    })
})

describe("withRedirect", () => {
    it("appends an encoded redirect", () => {
        expect(withRedirect("/employer/signin", "/employer/billing?buy=GROWTH")).toBe(
            "/employer/signin?redirect=%2Femployer%2Fbilling%3Fbuy%3DGROWTH",
        )
    })

    it("leaves the path alone with no redirect", () => {
        expect(withRedirect("/employer/signin", null)).toBe("/employer/signin")
    })
})
