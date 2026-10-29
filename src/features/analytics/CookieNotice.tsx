import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "gainday-cookie-notice-shown";

// Public pages only. Admin, dashboards and profile pages are behind sign-in and never show the notice.
const PUBLIC_PATHS = ["/landing", "/pricing", "/job-board", "/support", "/terms", "/privacy"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

// Without storage the notice can show on each visit, which is the safe default.
function wasShown(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberShown(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Storage blocked: the notice will show again next visit.
  }
}

/** Shown once per browser, the first time a public page is opened. */
export function CookieNotice() {
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const shown = !dismissed && !wasShown() && isPublicPath(pathname);

  useEffect(() => {
    if (shown) rememberShown();
  }, [shown]);

  if (!shown) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-md"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-lg bg-sky-50 p-2 text-sky-600">
          <Cookie className="size-4" />
        </div>
        <p className="text-xs text-neutral-600">
          We use cookies to improve your experience on our website. By continuing to browse, you agree to our use of cookies.{" "}
          <Link to="/privacy" className="font-medium text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline">
            Privacy policy
          </Link>
        </p>
      </div>
      {/* Both choices look the same on purpose: refusing must be as easy as accepting. They only close the notice for now. */}
      <div className="flex justify-start gap-2">
        <Button variant="outline" size="xs" onClick={() => setDismissed(true)}>
          Reject
        </Button>
        <Button variant="outline" size="xs" onClick={() => setDismissed(true)}>
          Accept
        </Button>
      </div>
    </div>
  );
}
