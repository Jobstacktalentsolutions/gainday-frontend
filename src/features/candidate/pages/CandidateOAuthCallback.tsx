import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { apiClient } from "@/lib/api/client";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import spinner from "@/assets/Spinner.svg";

export default function CandidateOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("No token received from Google");
      setTimeout(() => navigate("/candidate/signin"), 2000);
      return;
    }

    const fetchUser = async () => {
      try {
        useAuthStore.getState().setAuth(token, null as any);
        const response = await apiClient.get("/auth/me");
        useAuthStore.getState().setAuth(token, response.data.user);
        navigate("/job-board");
      } catch {
        setError("Failed to authenticate. Redirecting to login...");
        useAuthStore.getState().clearAuth();
        setTimeout(() => navigate("/candidate/signin"), 2000);
      }
    };

    fetchUser();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      <PublicNavbar />
      <main className="flex w-full justify-center px-4 pt-55 pb-12">
        <div className="flex w-full max-w-120 flex-col items-center gap-6 rounded-2xl bg-white px-10 py-12 text-center shadow-sm">
          {error ? (
            <p className="text-sm text-error-600">{error}</p>
          ) : (
            <>
              <img src={spinner} alt="Loading" className="h-8 w-8 animate-spin" />
              <p className="text-sm text-neutral-600">Completing sign in...</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
