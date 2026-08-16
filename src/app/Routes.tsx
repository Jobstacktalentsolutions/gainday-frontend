import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const AdminLogin = lazy(() => import("@/features/admin/pages/AdminLogin"));
const AdminLayout = lazy(() => import("@/features/admin/layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("@/features/admin/pages/AdminDashboard"));
const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const CreateAccount = lazy(() => import("@/features/auth/pages/CreateAccount"));
const SignInPage = lazy(() => import("@/features/auth/pages/SignIn"))
const ForgotPassword = lazy(() => import("@/features/auth/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/features/auth/pages/ResetPassword"));
const EmployerJobs = lazy(() => import("@/features/employer/pages/EmployerJobs"))
const EmployerLayout = lazy(() => import("@/features/employer/layouts/EmployerLayout"));


const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Navigate to="/landing" />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                </Route>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/employer">
                    <Route path="signup" element={<CreateAccount />} />
                    <Route path="signin" element={<SignInPage />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route element={<EmployerLayout />} >
                        <Route path="jobs" element={<EmployerJobs />} />
                    </Route>
                </Route>

            </Routes>
        </Suspense>

    );
}

export default AppRoutes;