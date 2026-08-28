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
const VerifyEmail = lazy(() => import("@/features/auth/pages/VerifyEmail"));
const OAuthCallback = lazy(() => import("@/features/auth/pages/OAuthCallback"));
const EmployerJobs = lazy(() => import("@/features/employer/pages/EmployerJobs"))
const EmployerDashboard = lazy(() => import("@/features/employer/pages/EmployerDashboard"));
const EmployerLayout = lazy(() => import("@/features/employer/layouts/EmployerLayout"));
const JobPostingWizardLayout = lazy(() => import("@/features/employer/layouts/JobPostingWizardLayout"));
const JobDetailsStep = lazy(() => import("@/features/employer/pages/JobDetailsStep"));
const SimulationBuilder = lazy(() => import("@/features/employer/pages/SimulationBuilder"));
const ReviewPublish = lazy(() => import("@/features/employer/pages/ReviewPublish"))
const UserManagement = lazy(() => import("@/features/admin/pages/UserManagement"))
const ContentModeration = lazy(() => import("@/features/admin/pages/ContentModeration"));



const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Navigate to="/landing" />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="content-moderation" element={<ContentModeration />} />
                </Route>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/employer">
                    <Route path="signup" element={<CreateAccount />} />
                    <Route path="signin" element={<SignInPage />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="verify-email" element={<VerifyEmail />} />
                    <Route path="oauth/callback" element={<OAuthCallback />} />
                    <Route element={<EmployerLayout />} >
                        <Route path="dashboard" element={<EmployerDashboard />} />
                        <Route path="jobs" element={<EmployerJobs />} />

                        <Route path="jobs/new" element={<JobPostingWizardLayout />}>
                            <Route index element={<Navigate to="details" replace />} />
                            <Route path="details" element={<JobDetailsStep />} />
                            <Route path="simulation-builder" element={<SimulationBuilder />} />
                            <Route path="review" element={<ReviewPublish />} />
                        </Route>
                    </Route>

                </Route>

            </Routes>
        </Suspense>

    );
}

export default AppRoutes;