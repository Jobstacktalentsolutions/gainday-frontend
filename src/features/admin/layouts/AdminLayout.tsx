import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useProtectedRoute } from "@/features/auth/hooks/useProtectedRoute";
import AppLoader from "@/components/ui/AppLoader";

const AdminLayout = () => {
    const { isAuthorized, isLoadingProfile } = useProtectedRoute({
        requiredRole: "ADMIN",
        redirectTo: "/admin/login",
    });

    if (isLoadingProfile || !isAuthorized) {
        return <AppLoader />;
    }

    return (
        <div className="flex  items-start bg-neutral-50">
            <AdminSidebar />
            <main className="flex flex-1 flex-col gap-6 px-10 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;