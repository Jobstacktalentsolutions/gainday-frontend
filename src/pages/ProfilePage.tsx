import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, AlertCircle } from "lucide-react";
import CandidateHeader from "@/features/candidate/components/CandidateHeader";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import ProfileForm from "@/components/profile/ProfileForm";

const ProfilePage = () => {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const isEmployer = user?.role === "EMPLOYER";
  const isCandidate = user?.role === "JOB_SEEKER";

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      {/* If accessed standalone or outside employer shell, render candidate/public navbar */}
      {!isEmployer && (user?.role === "JOB_SEEKER" ? <CandidateHeader /> : <PublicNavbar />)}

      <main className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-16 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        {/* Back navigation button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>

        {/* Profile Card with Ambient Gradient Blobs */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-[0px_4px_10px_rgba(16,24,40,0.05)] sm:p-10">
          {/* Decorative ambient gradient blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-5 -top-64 z-0 h-105 w-95 rotate-[-49deg] rounded-full opacity-35 blur-3xl bg-[linear-gradient(180deg,var(--color-primary-500)_40%,var(--color-secondary-500)_55%,var(--color-secondary-300)_65%,transparent_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-64 z-0 h-105 w-95 rotate-49 rounded-full opacity-35 blur-3xl bg-[linear-gradient(180deg,var(--color-primary-500)_40%,var(--color-secondary-500)_55%,var(--color-secondary-300)_65%,transparent_100%)]"
          />

          <div className="relative z-10 space-y-8">
            {/* Header with single person avatar icon */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-2 border-primary-100 bg-primary-50 text-primary-500 shadow-sm sm:size-24">
                <User className="size-10 text-primary-500 sm:size-12" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary-500">
                  Account Profile
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                  {user?.fullName || user?.companyName || "Gainday User"}
                </h1>
                <p className="text-sm text-neutral-500">{user?.email}</p>
              </div>
            </div>

            {isCandidate && user?.isProfileComplete === false && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-2xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-900"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>Your profile is incomplete. Add your job title to be able to apply for jobs.</p>
              </div>
            )}

            <div className="h-px w-full bg-neutral-100" />

            {user && <ProfileForm key={user.id} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
