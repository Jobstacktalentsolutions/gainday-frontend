import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CookieNotice } from "./CookieNotice";
import { CONSENT, getConsent, REJECTION_REMINDER_MS } from "./consent";

const renderNotice = () => render(<MemoryRouter initialEntries={["/"]}><CookieNotice /></MemoryRouter>);

describe("cookie notice", () => {
  const now = 1_800_000_000_000;

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Date, "now").mockReturnValue(now);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("keeps an accepted choice across visits", () => {
    const view = renderNotice();
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    view.unmount();
    vi.mocked(Date.now).mockReturnValue(now + REJECTION_REMINDER_MS * 3);
    renderNotice();
    expect(screen.queryByRole("region", { name: "Cookie notice" })).toBeNull();
    expect(getConsent()).toBe(CONSENT.granted);
  });

  it("reminds after four weeks while keeping analytics denied", () => {
    const view = renderNotice();
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));
    view.unmount();
    vi.mocked(Date.now).mockReturnValue(now + REJECTION_REMINDER_MS - 1);
    const beforeReminder = renderNotice();
    expect(screen.queryByRole("region", { name: "Cookie notice" })).toBeNull();
    beforeReminder.unmount();
    vi.mocked(Date.now).mockReturnValue(now + REJECTION_REMINDER_MS);
    renderNotice();
    expect(screen.getByRole("region", { name: "Cookie notice" })).toBeTruthy();
    expect(getConsent()).toBe(CONSENT.denied);
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));
    cleanup();
    renderNotice();
    expect(screen.queryByRole("region", { name: "Cookie notice" })).toBeNull();
  });

  it("starts the reminder period for an existing rejection", () => {
    localStorage.setItem("gainday-analytics-consent", CONSENT.denied);
    const view = renderNotice();
    expect(screen.queryByRole("region", { name: "Cookie notice" })).toBeNull();
    view.unmount();
    vi.mocked(Date.now).mockReturnValue(now + REJECTION_REMINDER_MS);
    renderNotice();
    expect(screen.getByRole("region", { name: "Cookie notice" })).toBeTruthy();
    expect(getConsent()).toBe(CONSENT.denied);
  });
});
