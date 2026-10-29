const COOKIE_NAME = "gd_vid";
const STORAGE_KEY = "gainday-visitor-id";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// The id is random and holds no personal data. The cookie keeps it across sessions, and localStorage
// is a second copy for browsers that block cookies. Both are best-effort: tracking works without them.
function readCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function readStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function persist(id: string): void {
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE_NAME}=${id}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // Cookies blocked: the localStorage copy below still keeps the id.
  }
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage blocked: the id lasts for this page load only.
  }
}

/** The visitor's first-party id, created on first visit and reused after that. */
export function getVisitorId(): string {
  const id = readCookie() ?? readStorage() ?? crypto.randomUUID();
  persist(id);
  return id;
}
