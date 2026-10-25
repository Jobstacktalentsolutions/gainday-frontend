import { describe, expect, it } from "vitest";
import { initialsOf, isSendShortcut } from "./chatHelpers";

describe("isSendShortcut", () => {
    it("sends on Ctrl+Enter or Cmd+Enter, but not on a plain Enter", () => {
        expect(isSendShortcut({ key: "Enter", ctrlKey: true, metaKey: false })).toBe(true);
        expect(isSendShortcut({ key: "Enter", ctrlKey: false, metaKey: true })).toBe(true);
        expect(isSendShortcut({ key: "Enter", ctrlKey: false, metaKey: false })).toBe(false);
        expect(isSendShortcut({ key: "a", ctrlKey: true, metaKey: false })).toBe(false);
    });
});

describe("initialsOf", () => {
    it("takes up to two initials from the display name", () => {
        expect(initialsOf("Priya Shah")).toBe("PS");
        expect(initialsOf("Sam")).toBe("S");
        expect(initialsOf("  maria  jose  lopez ")).toBe("MJ");
    });
});
