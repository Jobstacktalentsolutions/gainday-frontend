import { Navigate, useSearchParams } from "react-router-dom";

/**
 * Verification emails sent before the link was fixed point at /auth/verify-email
 * on the frontend host. Forward them to the real role-specific page.
 */
const LegacyVerifyEmailRedirect = () => {
  const [searchParams] = useSearchParams();
  const rolePath = searchParams.get("role") === "JOB_SEEKER" ? "candidate" : "employer";
  const token = searchParams.get("token");
  const query = token ? `?token=${encodeURIComponent(token)}` : "";

  return <Navigate to={`/${rolePath}/verify-email${query}`} replace />;
};

export default LegacyVerifyEmailRedirect;
