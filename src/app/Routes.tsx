import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const AdminLogin = lazy(() => import("@/features/admin/pages/AdminLogin"))

const AppRoutes = () => {
    return(
        <Routes>
            <Route path ="/admin/login" element = {<AdminLogin />} />
        </Routes>
    );
}

export default AppRoutes;