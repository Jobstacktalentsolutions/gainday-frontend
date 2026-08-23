import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { apiClient } from "@/lib/api/client";
import AuthCard from "../component/AuthCard";
import spinner from "@/assets/Spinner.svg";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("No token received from Google");
      setLoading(false);
      setTimeout(() => navigate("/employer/signin"), 2000);
      return;
    }

    const fetchUser = async () => {
      try {
        useAuthStore.getState().setAuth(token, null as any);
        const response = await apiClient.get("/auth/me");
        useAuthStore.getState().setAuth(token, response.data.user);
        navigate("/employer/dashboard");
      } catch (err) {
        setError("Failed to authenticate. Redirecting to login...");
        useAuthStore.getState().clearAuth();
        setTimeout(() => navigate("/employer/signin"), 2000);
      }
    };

    fetchUser();
  }, [searchParams, navigate]);

  return (
    <AuthCard title="" subtitle="">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        {error ? (
          <>
            <p className="text-sm text-error-600">{error}</p>
          </>
        ) : (
          <>
            <img
              src={spinner}
              alt="Loading"
              className="w-8 h-8 animate-spin"
            />
            <p className="text-sm text-neutral-600">Completing sign in...</p>
          </>
        )}
      </div>
    </AuthCard>
  );
};

export default OAuthCallback;
