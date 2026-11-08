import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api/client";
import { usePageViewTracker } from "./usePageViewTracker";

vi.mock("@/lib/api/client", () => ({ apiClient: { post: vi.fn() } }));

const routerAt = (path: string) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>;
  };

describe("usePageViewTracker", () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockClear();
    vi.mocked(apiClient.post).mockResolvedValue({} as never);
    localStorage.clear();
    document.cookie = "gd_vid=; max-age=0";
    localStorage.setItem("gainday-analytics-consent", "granted");
  });

  it("sends one ping for a page view", () => {
    renderHook(() => usePageViewTracker(), { wrapper: routerAt("/job-board") });

    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith("/analytics/ping", { visitorId: expect.any(String) });
  });

  it("does not ping again for the same path within the dedupe window", () => {
    const first = renderHook(() => usePageViewTracker(), { wrapper: routerAt("/pricing") });
    first.unmount();

    renderHook(() => usePageViewTracker(), { wrapper: routerAt("/pricing") });

    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  it("does not ping without consent", () => {
    localStorage.setItem("gainday-analytics-consent", "denied");
    renderHook(() => usePageViewTracker(), { wrapper: routerAt("/support") });
    expect(apiClient.post).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain("gd_vid");
  });
});
