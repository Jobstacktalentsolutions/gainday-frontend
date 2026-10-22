import { Outlet, useLocation, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import AppLoader from "@/components/ui/AppLoader";
import { isRouteAllowedForRole } from "../utils/rolePermissions";

const AdminLayout = () => {
    const location = useLocation();
    const { user, accessToken, isAuthenticated, isLoadingProfile } = useCurrentUser();

    // A token exists but the profile hasn't resolved yet — show loader
    if (accessToken && (!user || isLoadingProfile)) {
        return <AppLoader />;
    }

    if (!isAuthenticated || user?.role !== "ADMIN") {
        const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
        return <Navigate to={`/admin/login?redirect=${redirect}`} replace />;
    }

    const isPathAllowed = isRouteAllowedForRole(
        location.pathname,
        user?.adminRole,
        user?.isSuperAdmin
    );

    if (!isPathAllowed) {
        return <Navigate to="/admin/overview" replace />;
    }

    return (
        <div className="flex items-start bg-neutral-50 min-h-screen">
            <AdminSidebar />
            <main className="flex flex-1 flex-col gap-6 px-10 py-8 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;