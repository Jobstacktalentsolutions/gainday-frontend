import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import CandidateHeader from "./CandidateHeader";
import { PublicNavbar } from "./PublicNavbar";

// The job board is public. Signed-in job seekers get the candidate navigation; everyone else gets
// the public header, which never calls candidate-only endpoints.
export function JobBoardHeader() {
    const { user, isAuthenticated, isLoadingProfile } = useCurrentUser();

    // Wait for the profile so a job seeker does not see the public header flash past.
    if (isLoadingProfile) return null;

    return isAuthenticated && user?.role === "JOB_SEEKER" ? <CandidateHeader /> : <PublicNavbar />;
}
