import { Navigate, Outlet, useLocation } from "react-router-dom";
import AppLoader from "@/components/ui/AppLoader";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

// Layout route that keeps every candidate page behind sign-in. Signed-out visitors are sent to
// candidate sign-in with a ?redirect back to where they were going (the sign-in page already
// honours that param); signed-in non-candidates are sent to their own area.
const CandidateRoute = () => {
    const location = useLocation();
    const { user, accessToken, isAuthenticated, isLoadingProfile } = useCurrentUser();

    if (!isAuthenticated) {
        // A token exists but the profile is still loading — don't bounce them to sign-in yet.
        if (accessToken && isLoadingProfile) return <AppLoader />;
        const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
        return <Navigate to={`/candidate/signin?redirect=${redirect}`} replace />;
    }

    if (user?.role !== "JOB_SEEKER") {
        return <Navigate to={user?.role === "EMPLOYER" ? "/employer/jobs" : "/landing"} replace />;
    }

    return <Outlet />;
};

export default CandidateRoute;