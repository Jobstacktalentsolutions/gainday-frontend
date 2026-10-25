import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { useAuthStore, type AuthUser } from "../store/authStore";
import { resolvePostLoginPath } from "../utils/roleDashboard";

interface GoogleSignInResponse {
    access_token: string;
    user: AuthUser;
}

const FALLBACK_MESSAGE = "Google sign-in didn't work. Please try again.";

/** Signs in with the Google ID token from the button or One Tap. Login only: the backend never
 *  creates an account here. */
export function useGoogleSignIn(redirect: string | null) {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (credential: string) =>
            (await apiClient.post<GoogleSignInResponse>("/auth/google", { credential })).data,
        onSuccess: ({ access_token, user }) => {
            setAuth(access_token, user);
            navigate(resolvePostLoginPath(user.role, redirect), { replace: true });
        },
        onError: (error) => {
            const message = isAxiosError<{ message?: unknown }>(error)
                ? error.response?.data?.message
                : undefined;
            toast.error(typeof message === "string" ? message : FALLBACK_MESSAGE);
        },
    });
}
