const KEY = "gainday-analytics-consent";
const DENIED_AT_KEY = "gainday-analytics-consent-denied-at";
export const CONSENT = { granted: "granted", denied: "denied" } as const;
export const REJECTION_REMINDER_MS = 28 * 24 * 60 * 60 * 1000;

export type Consent = (typeof CONSENT)[keyof typeof CONSENT];

export function getConsent(): Consent | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === CONSENT.granted || value === CONSENT.denied ? value : null;
  } catch {
    return null; // Storage blocked: treated as undecided, so nothing is tracked.
  }
}

export function setConsent(value: Consent): void {
  try {
    localStorage.setItem(KEY, value);
    if (value === CONSENT.denied) {
      localStorage.setItem(DENIED_AT_KEY, String(Date.now()));
    } else {
      localStorage.removeItem(DENIED_AT_KEY);
    }
  } catch {
    // Storage blocked: the choice only lasts for this page load.
  }
}

export function shouldShowConsentNotice(): boolean {
  const consent = getConsent();
  if (consent === null) return true;
  if (consent === CONSENT.granted) return false;

  try {
    const stored = localStorage.getItem(DENIED_AT_KEY);
    const deniedAt = stored === null ? NaN : Number(stored);
    if (!Number.isFinite(deniedAt) || deniedAt > Date.now()) {
      // Existing rejections have no timestamp. Start their reminder period now.
      localStorage.setItem(DENIED_AT_KEY, String(Date.now()));
      return false;
    }
    return Date.now() - deniedAt >= REJECTION_REMINDER_MS;
  } catch {
    return false;
  }
}
