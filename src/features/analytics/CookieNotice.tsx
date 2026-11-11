import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConsent, setConsent, type Consent } from "./consent";
import { clearVisitorId } from "./visitorId";

// Public pages only. Admin, dashboards and profile pages are behind sign-in and never show the notice.
const PUBLIC_PATHS = ["/landing", "/pricing", "/job-board", "/support", "/terms", "/privacy"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/** Asks once, on a public page, whether anonymous visit counting is allowed. Until answered, nothing is tracked. */
export function CookieNotice() {
  const { pathname } = useLocation();
  const [consent, setLocalConsent] = useState<Consent | null>(getConsent);

  if (consent !== null || !isPublicPath(pathname)) return null;

  const choose = (value: Consent) => {
    setConsent(value);
    if (value === "denied") clearVisitorId();
    setLocalConsent(value);
  };

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
          Essential storage keeps you signed in. With your permission we also use a cookie to count visits
          anonymously and improve Gainday. If you reject, we don&apos;t track visits.{" "}
          <Link to="/privacy" className="font-medium text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline">
            Privacy policy
          </Link>
        </p>
      </div>
      {/* Same look on purpose: refusing must be as easy as accepting. */}
      <div className="flex justify-start gap-2">
        <Button className="cursor-pointer" variant="outline" size="xs" onClick={() => choose("denied")}>
          Reject
        </Button>
        <Button className="cursor-pointer" variant="outline" size="xs" onClick={() => choose("granted")}>
          Accept
        </Button>
      </div>
    </div>
  );
}