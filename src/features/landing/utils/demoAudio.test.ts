import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { claimPlayback, releasePlayback, useDemoAudio } from "./demoAudio";

describe("demo audio", () => {
    beforeEach(() => useDemoAudio.setState({ muted: true }));

    it("starts muted, because browsers block autoplay with sound", () => {
        expect(useDemoAudio.getState().muted).toBe(true);
    });

    it("can be unmuted for every player at once", () => {
        useDemoAudio.getState().setMuted(false);
        expect(useDemoAudio.getState().muted).toBe(false);
    });
});

describe("one demo plays at a time", () => {
    const first = vi.fn();
    const second = vi.fn();

    afterEach(() => {
        releasePlayback(first);
        releasePlayback(second);
        first.mockClear();
        second.mockClear();
    });

    it("pauses the previous player when another one starts", () => {
        claimPlayback(first);
        claimPlayback(second);
        expect(first).toHaveBeenCalledTimes(1);
        expect(second).not.toHaveBeenCalled();
    });

    it("does not pause a player that has released", () => {
        claimPlayback(first);
        releasePlayback(first);
        claimPlayback(second);
        expect(first).not.toHaveBeenCalled();
    });
});
