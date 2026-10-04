import { Outlet, useLocation, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useProtectedRoute } from "@/features/auth/hooks/useProtectedRoute";
import { useAuthStore } from "@/features/auth/store/authStore";
import AppLoader from "@/components/ui/AppLoader";
import { isRouteAllowedForRole } from "../utils/rolePermissions";

const AdminLayout = () => {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const { isAuthorized, isLoadingProfile } = useProtectedRoute({
        requiredRole: "ADMIN",
        redirectTo: "/admin/login",
    });

    if (isLoadingProfile || !isAuthorized) {
        return <AppLoader />;
    }

    const isPathAllowed = isRouteAllowedForRole(
        location.pathname,
        user?.adminRole,
        user?.isSuperAdmin
    );

    if (!isPathAllowed) {
        return <Navigate to="/admin/dashboard" replace />;
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