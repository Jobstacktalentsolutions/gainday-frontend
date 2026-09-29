import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLoader from "@/components/ui/AppLoader";
import { useSimulationRunStore } from "@/features/candidate/store/useSimulationRunStore";

// DEV-ONLY: resets any stale completed-run state before entering the simulation.
// Uses getState() so the reset is synchronous and fires before the first render
// of TaskRunner — avoiding the localStorage hydration race that shows the
// "simulation complete" modal immediately.
function DevSimulationStart() {
    useSimulationRunStore.getState().resetRun();
    return <Navigate to="/job-board/job-1/simulation" replace />;
}


const AdminLogin = lazy(() => import("@/features/admin/pages/AdminLogin"));
const AdminLayout = lazy(() => import("@/features/admin/layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("@/features/admin/pages/AdminDashboard"));
const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const CreateAccount = lazy(() => import("@/features/auth/pages/CreateAccount"));
const SignInPage = lazy(() => import("@/features/auth/pages/SignIn"))
const ForgotPassword = lazy(() => import("@/features/auth/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/features/auth/pages/ResetPassword"));
const VerifyEmail = lazy(() => import("@/features/auth/pages/VerifyEmail"));
const LegacyVerifyEmailRedirect = lazy(() => import("@/features/auth/pages/LegacyVerifyEmailRedirect"));
const OAuthCallback = lazy(() => import("@/features/auth/pages/OAuthCallback"));
const EmployerJobs = lazy(() => import("@/features/employer/pages/EmployerJobs"))
const EmployerLayout = lazy(() => import("@/features/employer/layouts/EmployerLayout"));
const JobPostingWizardLayout = lazy(() => import("@/features/employer/layouts/JobPostingWizardLayout"));
const JobDetailsStep = lazy(() => import("@/features/employer/pages/JobDetailsStep"));
const SimulationBuilder = lazy(() => import("@/features/employer/pages/SimulationBuilder"));
const ReviewPublish = lazy(() => import("@/features/employer/pages/ReviewPublish"))
const EmployerManagement = lazy(() => import("@/features/admin/pages/EmployerManagement"))
const CandidateManagement = lazy(() => import("@/features/admin/pages/CandidateManagement"))
const ContentModeration = lazy(() => import("@/features/admin/pages/ContentModeration"));
const GenerationReviews = lazy(() => import("@/features/admin/pages/GenerationReviews"));
const AiOversight = lazy(() => import("@/features/admin/pages/AiOversight"));
const JobPreview = lazy(() => import("@/features/employer/pages/JobPreview"));
const JobBoardPage = lazy(() => import("@/features/candidate/pages/JobBoardPage"));
const JobDetailsPage = lazy(() => import("@/features/candidate/pages/candidateJobDetails"));
const CandidateSignUp = lazy(() => import("@/features/candidate/pages/CandidateSignUp"));
const CandidateSignIn = lazy(() => import("@/features/candidate/pages/CandidateSignIn"));
const CandidateForgotPassword = lazy(() => import("@/features/candidate/pages/CandidateForgotPassword"));
const CandidateResetPassword = lazy(() => import("@/features/candidate/pages/CandidateResetPassword"));
const CandidateVerifyEmail = lazy(() => import("@/features/candidate/pages/CandidateVerifyEmail"));
const CandidateOAuthCallback = lazy(() => import("@/features/candidate/pages/CandidateOAuthCallback"));
const PreSimulation = lazy(() => import("@/features/candidate/pages/PreSimulation"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const EnvironmentCheckPage = lazy(() => import("@/features/candidate/pages/EnvironmentCheckPage"));
const TaskRunner = lazy(() => import("@/features/candidate/pages/TaskRunner"));


const AppRoutes = () => {
    return (
        <Suspense fallback={<AppLoader />}>
            <Routes>
                <Route path="/" element={<Navigate to="/landing" />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="employer-management" element={<EmployerManagement />} />
                    <Route path="candidate-management" element={<CandidateManagement />} />
                    <Route path="content-moderation" element={<ContentModeration />} />
                    <Route path="generation-reviews" element={<GenerationReviews />} />
                    <Route path="ai-oversight" element={<AiOversight />} />
                </Route>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/auth/verify-email" element={<LegacyVerifyEmailRedirect />} />
                <Route path="/employer">
                    <Route path="signup" element={<CreateAccount />} />
                    <Route path="signin" element={<SignInPage />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="verify-email" element={<VerifyEmail />} />
                    <Route path="oauth/callback" element={<OAuthCallback />} />
                    <Route element={<EmployerLayout />} >
                        <Route index element={<Navigate to="jobs" replace />} />
                        <Route path="dashboard" element={<Navigate to="/employer/jobs" replace />} />
                        <Route path="jobs" element={<EmployerJobs />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="jobs/new" element={<JobPostingWizardLayout />}>
                            <Route index element={<Navigate to="details" replace />} />
                            <Route path="details" element={<JobDetailsStep />} />
                            <Route path="simulation-builder" element={<SimulationBuilder />} />
                            <Route path="review" element={<ReviewPublish />} />
                        </Route>
                    </Route>
                    {/* Standalone full-page route, no employer shell */}
                    <Route path="jobs/:jobId/preview" element={<JobPreview />} />

                </Route>

                <Route path="/job-board" element={<JobBoardPage />} />
                <Route path="/job-board/:jobId" element={<JobDetailsPage />} />
                <Route path="/job-board/:jobId/pre-simulation" element={<PreSimulation />} />
                <Route path="/job-board/:jobId/environment-check" element={<EnvironmentCheckPage />} />
                <Route path="/job-board/:jobId/simulation" element={<TaskRunner />} />
                {/* Dev-only route — quick access without a real jobId */}
                {import.meta.env.DEV && (
                    <>
                        <Route path="/dev/pre-simulation" element={<PreSimulation />} />
                        <Route path="/dev/environment-check" element={<EnvironmentCheckPage />} />
                        {/* /dev/simulation → resets stale state then loads the real route with mock job-1
                            (Custody Operations / Finance — 3 tasks) */}
                        <Route path="/dev/simulation" element={<DevSimulationStart />} />
                    </>
                )}
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/candidate">
                    <Route path="signup" element={<CandidateSignUp />} />
                    <Route path="signin" element={<CandidateSignIn />} />
                    <Route path="forgot-password" element={<CandidateForgotPassword />} />
                    <Route path="reset-password" element={<CandidateResetPassword />} />
                    <Route path="verify-email" element={<CandidateVerifyEmail />} />
                    <Route path="oauth/callback" element={<CandidateOAuthCallback />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>

    );
}

export default AppRoutes;