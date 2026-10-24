import { describe, expect, it } from "vitest"
import { getFirstName } from "./getFirstName"

describe("getFirstName", () => {
    it("returns the first word of a full name", () => {
        expect(getFirstName("Amara Okafor")).toBe("Amara")
        expect(getFirstName("  Amara   Okafor ")).toBe("Amara")
    })

    it("returns null when there's no usable name", () => {
        expect(getFirstName("")).toBeNull()
        expect(getFirstName("   ")).toBeNull()
        expect(getFirstName(undefined)).toBeNull()
        expect(getFirstName(null)).toBeNull()
    })
})