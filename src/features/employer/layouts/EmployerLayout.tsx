import { Outlet } from "react-router-dom";
import EmployerTopNav from "../components/EmployerTopNav";
import { useProtectedRoute } from "@/features/auth/hooks/useProtectedRoute";
import AppLoader from "@/components/ui/AppLoader";


const EmployerLayout = () => {
    const { isAuthorized, isLoadingProfile } = useProtectedRoute({ requiredRole: "EMPLOYER" });

    if (isLoadingProfile || !isAuthorized) {
        return <AppLoader />;
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <EmployerTopNav />
            <Outlet />
        </div>
    );
}

export default EmployerLayout;