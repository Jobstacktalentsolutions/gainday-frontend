import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { CookieNotice } from "./CookieNotice";

const renderNotice = () =>
  render(
    <MemoryRouter>
      <CookieNotice />
    </MemoryRouter>,
  );

describe("CookieNotice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the notice with a link to the privacy policy until dismissed", async () => {
    renderNotice();

    expect(screen.getByRole("region", { name: "Cookie notice" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/privacy");

    await userEvent.click(screen.getByRole("button", { name: "Accept" }));

    expect(screen.queryByRole("region", { name: "Cookie notice" })).not.toBeInTheDocument();
  });

  it("closes the notice when rejected too", async () => {
    renderNotice();

    await userEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(screen.queryByRole("region", { name: "Cookie notice" })).not.toBeInTheDocument();
  });

  it("stays hidden on later visits once dismissed", () => {
    localStorage.setItem("gainday-cookie-notice-acknowledged", "true");

    renderNotice();

    expect(screen.queryByRole("region", { name: "Cookie notice" })).not.toBeInTheDocument();
  });
});
