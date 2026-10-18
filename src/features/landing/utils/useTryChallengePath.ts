import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

// Where "Try a challenge" should send the current visitor. Every candidate page needs an
// account, so signed-out visitors (and anyone who isn't a candidate) go to candidate sign-up,
// while a signed-in candidate goes straight to the job board.
export const useTryChallengePath = (): string => {
    const { user, isAuthenticated } = useCurrentUser();
    return isAuthenticated && user?.role === "JOB_SEEKER" ? "/job-board" : "/candidate/signup";
};