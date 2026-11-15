import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useClipboardMonitoring } from "./useClipboardMonitoring";
import { useSimulationIntegrityStore } from "./useSimulationIntegrityStore";

describe("clipboard monitoring", () => {
    afterEach(() => useSimulationIntegrityStore.getState().reset());

    it("records actions against the active task only while enabled", () => {
        const { rerender, unmount } = renderHook(
            ({ enabled, taskId }) => useClipboardMonitoring(enabled, taskId),
            { initialProps: { enabled: true, taskId: "task-1" } },
        );
        act(() => document.dispatchEvent(new Event("copy", { bubbles: true })));
        rerender({ enabled: true, taskId: "task-2" });
        act(() => document.dispatchEvent(new Event("paste", { bubbles: true })));
        rerender({ enabled: false, taskId: "task-2" });
        act(() => document.dispatchEvent(new Event("paste", { bubbles: true })));
        unmount();
        act(() => document.dispatchEvent(new Event("copy", { bubbles: true })));

        expect(useSimulationIntegrityStore.getState().events).toEqual([
            { type: "copy", taskId: "task-1", occurredAt: expect.any(String) },
            { type: "paste", taskId: "task-2", occurredAt: expect.any(String) },
        ]);
    });
});
