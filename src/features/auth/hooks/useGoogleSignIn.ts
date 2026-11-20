import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { useAuthStore, type AuthUser } from "../store/authStore";
import { authErrorMessage } from "../utils/authErrorMessage";
import { resolvePostLoginPath } from "../utils/roleDashboard";

interface GoogleSignInResponse {
    access_token: string;
    user: AuthUser;
}

const FALLBACK_MESSAGE = "Google sign-in didn't work. Please try again.";

/** Signs in with the Google ID token from the button or One Tap. Login only: the backend never
 *  creates an account here. */
export function useGoogleSignIn(redirect: string | null, portal: "employer" | "candidate") {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (credential: string) =>
            (await apiClient.post<GoogleSignInResponse>(`/auth/${portal}/google`, { credential })).data,
        onSuccess: ({ access_token, user }) => {
            setAuth(access_token, user);
            navigate(resolvePostLoginPath(user.role, redirect), { replace: true });
        },
        onError: (error) => {
            toast.error(authErrorMessage(error, FALLBACK_MESSAGE));
        },
    });
}
