import { Navigate, Outlet, useLocation } from "react-router-dom";
import AppLoader from "@/components/ui/AppLoader";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

// Pathless layout route that keeps every employer page behind sign-in. Signed-out
// visitors are sent to employer sign-in with a ?redirect= back to where they were
// going (SignIn.tsx already honours that param); signed-in non-employers are sent
// to their own area. Renders <Outlet /> only — no nav or wrapper markup — so
// standalone pages like JobPreview keep their own headers.
const EmployerRoute = () => {
    const location = useLocation();
    const { user, accessToken, isAuthenticated, isLoadingProfile } = useCurrentUser();

    // A token exists but the profile hasn't resolved yet — show loader to avoid
    // flashing the sign-in page.
    if (accessToken && (!user || isLoadingProfile)) {
        return <AppLoader />;
    }

    if (!isAuthenticated) {
        const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
        return <Navigate to={`/employer/signin?redirect=${redirect}`} replace />;
    }

    if (user?.role !== "EMPLOYER") {
        if (user?.role === "JOB_SEEKER") return <Navigate to="/job-board" replace />;
        if (user?.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/landing" replace />;
    }

    return <Outlet />;
};

export default EmployerRoute;
