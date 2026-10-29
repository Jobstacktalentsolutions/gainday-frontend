import { beforeEach, describe, expect, it } from "vitest";
import { getVisitorId } from "./visitorId";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe("getVisitorId", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "gd_vid=; Max-Age=0; Path=/";
  });

  it("creates an id on the first visit and reuses it after that", () => {
    const first = getVisitorId();

    expect(first).toMatch(UUID);
    expect(getVisitorId()).toBe(first);
  });

  it("prefers the id already in the cookie", () => {
    document.cookie = "gd_vid=existing-visitor; Path=/";

    expect(getVisitorId()).toBe("existing-visitor");
  });
});
