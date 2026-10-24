import { afterEach, describe, expect, it, vi } from "vitest"
import { copyToClipboard, getJobShareUrl, shareLink } from "./shareLink"

interface Env {
    touch?: boolean
    share?: () => Promise<void>
    canShare?: () => boolean
    writeText?: (text: string) => Promise<void>
    execCommand?: boolean
}

const setEnv = ({ touch = false, share, canShare, writeText, execCommand = false }: Env) => {
    for (const [key, value] of Object.entries({
        share,
        canShare,
        clipboard: writeText ? { writeText } : undefined,
    })) {
        Object.defineProperty(navigator, key, { value, configurable: true, writable: true })
    }
    window.matchMedia = ((query: string) => ({
        matches: touch && query.includes("coarse"),
    })) as unknown as typeof window.matchMedia
    document.execCommand = vi.fn(() => execCommand)
}

const options = { title: "Analyst at Acme", text: "Take a look", url: "https://app.test/job-board/1" }

afterEach(() => setEnv({}))

describe("shareLink", () => {
    it("uses the native share sheet on touch devices", async () => {
        const share = vi.fn().mockResolvedValue(undefined)
        const writeText = vi.fn().mockResolvedValue(undefined)
        setEnv({ touch: true, share, writeText })

        expect(await shareLink(options)).toBe("shared")
        expect(share).toHaveBeenCalledWith(options)
        expect(writeText).not.toHaveBeenCalled()
    })

    it("treats closing the sheet as cancelled and copies nothing", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined)
        setEnv({
            touch: true,
            share: vi.fn().mockRejectedValue(new DOMException("closed", "AbortError")),
            writeText,
        })

        expect(await shareLink(options)).toBe("cancelled")
        expect(writeText).not.toHaveBeenCalled()
    })

    it("falls back to copying when sharing fails for another reason", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined)
        setEnv({
            touch: true,
            share: vi.fn().mockRejectedValue(new DOMException("denied", "NotAllowedError")),
            writeText,
        })

        expect(await shareLink(options)).toBe("copied")
        expect(writeText).toHaveBeenCalledWith(options.url)
    })

    it("copies instead of sharing on desktop, even if the browser supports sharing", async () => {
        const share = vi.fn().mockResolvedValue(undefined)
        const writeText = vi.fn().mockResolvedValue(undefined)
        setEnv({ touch: false, share, writeText })

        expect(await shareLink(options)).toBe("copied")
        expect(share).not.toHaveBeenCalled()
    })

    it("uses the textarea fallback when the clipboard API is missing", async () => {
        setEnv({ execCommand: true })
        expect(await shareLink(options)).toBe("copied")
        expect(document.execCommand).toHaveBeenCalledWith("copy")
        expect(document.querySelector("textarea")).toBeNull()
    })

    it("reports failure when nothing works", async () => {
        setEnv({ writeText: vi.fn().mockRejectedValue(new Error("denied")), execCommand: false })
        expect(await shareLink(options)).toBe("failed")
    })
})

describe("copyToClipboard / getJobShareUrl", () => {
    it("copyToClipboard resolves true on success", async () => {
        setEnv({ writeText: vi.fn().mockResolvedValue(undefined) })
        expect(await copyToClipboard("hi")).toBe(true)
    })

    it("builds job links from the current origin, under /job-board", () => {
        expect(getJobShareUrl("abc")).toBe(`${window.location.origin}/job-board/abc`)
    })
})