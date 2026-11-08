const KEY = "gainday-analytics-consent";

export type Consent = "granted" | "denied";

export function getConsent(): Consent | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null; // Storage blocked: treated as undecided, so nothing is tracked.
  }
}

export function setConsent(value: Consent): void {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked: the choice only lasts for this page load.
  }
}