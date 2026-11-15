import { describe, expect, it } from "vitest";
import { getMissingProfileFields, getProfileWarning } from "./profileCompletion";
import { AUTH_ROLES } from "./roles";

describe("profile warning", () => {
  const base = { id: "1", email: "user@example.com" };

  it("requires an employer phone number to clear the warning", () => {
    expect(getMissingProfileFields({ ...base, role: AUTH_ROLES.employer })).toEqual(["phone number"]);
    expect(getMissingProfileFields({ ...base, role: AUTH_ROLES.employer, phoneNumber: "+442079460123" })).toEqual([]);
  });

  it("requires a candidate job title and phone number", () => {
    expect(getMissingProfileFields({ ...base, role: AUTH_ROLES.candidate })).toEqual(["job title", "phone number"]);
    expect(getMissingProfileFields({ ...base, role: AUTH_ROLES.candidate, title: "Engineer", phoneNumber: "+442079460123" })).toEqual([]);
  });

  it("names exactly what is missing in the banner", () => {
    expect(getProfileWarning([])).toBeNull();
    expect(getProfileWarning(["phone number"])).toBe("Add your phone number to complete your profile.");
    expect(getProfileWarning(["job title", "phone number"])).toBe(
      "Add your job title and phone number to complete your profile. You need a job title to apply for jobs.",
    );
  });
});