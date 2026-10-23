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

const SupportMessages = lazy(() => import("@/features/admin/pages/SupportMessages"));
const Notifications = lazy(() => import("@/features/admin/pages/Notifications"));
const CreditManagement = lazy(() => import("@/features/admin/pages/CreditManagement"));
const JobModerationDetailPage = lazy(() => import("@/features/admin/pages/JobModerationDetailPage"));
const JobPreview = lazy(() => import("@/features/employer/pages/JobPreview"));
const JobSubmissions = lazy(() => import("@/features/employer/pages/JobSubmissions"));
const EmployerCandidates = lazy(() => import("@/features/employer/pages/EmployerCandidate"));
const SubmissionDetail = lazy(() => import("@/features/employer/pages/SubmissionDetail"));
const BillingPage = lazy(() => import("@/features/employer/pages/BillingPage"));
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
const EmailPreferencesPage = lazy(() => import("@/features/email-preferences/pages/EmailPreferencesPage"));
const EnvironmentCheckPage = lazy(() => import("@/features/candidate/pages/EnvironmentCheckPage"));
const TaskRunner = lazy(() => import("@/features/candidate/pages/TaskRunner"));
const SubmissionResultPage = lazy(() => import("@/features/candidate/pages/SubmissionResultPage"));
const CandidateRoute = lazy(() => import("@/features/candidate/components/CandidateRoute"));
const EmployerRoute = lazy(() => import("@/features/employer/components/EmployerRoute"));
const MyApplications = lazy(() => import("@/features/candidate/pages/MyApplications"));
const ApplicationDetailPage = lazy(() => import("@/features/candidate/pages/ApplicationDetailPage"));
const ApplicationSubmissionPage = lazy(() => import("@/features/candidate/pages/ApplicationSubmissionPage"));
const CapabilityPassportPage = lazy(() => import("@/features/candidate/pages/CapabilityPassportPage"));
const SupportPage = lazy(() => import("@/pages/SupportPage"));
const LegalPage = lazy(() => import("@/features/legal/pages/LegalPage"));


const AppRoutes = () => {
    return (
        <Suspense fallback={<AppLoader />}>
            <Routes>
                <Route path="/" element={<Navigate to="/landing" />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<AdminDashboard />} />
                    <Route path="dashboard" element={<Navigate to="overview" replace />} />
                    <Route path="employer-management" element={<EmployerManagement />} />
                    <Route path="candidate-management" element={<CandidateManagement />} />
                    <Route path="content-moderation" element={<ContentModeration />} />
                    <Route path="content-moderation/jobs/:id" element={<JobModerationDetailPage />} />
                    <Route path="generation-reviews" element={<Navigate to="/admin/content-moderation" replace />} />
                    <Route path="support-messages" element={<SupportMessages />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="credits" element={<CreditManagement />} />
                </Route>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/auth/verify-email" element={<LegacyVerifyEmailRedirect />} />
                <Route path="/email-preferences" element={<EmailPreferencesPage />} />
                <Route path="/employer">
                    {/* Public auth routes — reachable while signed out */}
                    <Route path="signup" element={<CreateAccount />} />
                    <Route path="signin" element={<SignInPage />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="verify-email" element={<VerifyEmail />} />
                    <Route path="oauth/callback" element={<OAuthCallback />} />

                    {/* All pages that require a signed-in employer */}
                    <Route element={<EmployerRoute />}>
                        <Route element={<EmployerLayout />}>
                            <Route index element={<Navigate to="jobs" replace />} />
                            <Route path="dashboard" element={<Navigate to="/employer/jobs" replace />} />
                            <Route path="jobs" element={<EmployerJobs />} />
                            <Route path="candidates" element={<EmployerCandidates />} />
                            <Route path="jobs/:jobId/submissions" element={<JobSubmissions />} />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="billing" element={<BillingPage />} />
                            <Route path="jobs/new" element={<JobPostingWizardLayout />}>
                                <Route index element={<Navigate to="details" replace />} />
                                <Route path="details" element={<JobDetailsStep />} />
                                <Route path="simulation-builder" element={<SimulationBuilder />} />
                                <Route path="review" element={<ReviewPublish />} />
                            </Route>
                        </Route>

                        {/* Standalone full-page routes, no employer shell, but still guarded */}
                        <Route path="jobs/:jobId/preview" element={<JobPreview />} />
                        <Route path="jobs/:jobId/submissions/:submissionId" element={<SubmissionDetail />} />
                    </Route>
                </Route>

                {/* Every candidate page requires a signed-in candidate */}
                <Route element={<CandidateRoute />}>
                    <Route path="/job-board" element={<JobBoardPage />} />
                    <Route path="/job-board/:jobId" element={<JobDetailsPage />} />
                    <Route path="/job-board/:jobId/pre-simulation" element={<PreSimulation />} />
                    <Route path="/job-board/:jobId/environment-check" element={<EnvironmentCheckPage />} />
                    <Route path="/job-board/:jobId/simulation" element={<TaskRunner />} />
                    <Route path="/job-board/submissions/:submissionId/result" element={<SubmissionResultPage />} />
                    <Route path="/candidate/submissions/:submissionId/result" element={<SubmissionResultPage />} />
                    <Route path="/candidate/applications" element={<MyApplications />} />
                    <Route path="/candidate/applications/:applicationId" element={<ApplicationDetailPage />} />
                    <Route path="/candidate/applications/:applicationId/submission" element={<ApplicationSubmissionPage />} />
                    <Route path="/candidate/passport" element={<CapabilityPassportPage />} />
                    <Route path="/candidate/profile" element={<ProfilePage />} />
                </Route>



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
                </Route>

                <Route path="/support" element={<SupportPage />} />

                {/* legal pages*/}
                <Route path="/terms" element={<Navigate to="/terms/candidate" replace />} />
                <Route path="/terms/:audience" element={<LegalPage kind="terms" />} />
                <Route path="/privacy" element={<Navigate to="/privacy/candidate" replace />} />
                <Route path="/privacy/:audience" element={<LegalPage kind="privacy" />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>

    );
}

export default AppRoutes;
