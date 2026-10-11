import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "../store/authStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    // Read the role first — clearAuth() wipes it, and candidates sign in on their own page.
    const role = useAuthStore.getState().user?.role;
    try {
      await apiClient.post("/auth/logout");
    } finally {
      clearAuth();
      navigate(role === "JOB_SEEKER" ? "/candidate/signin" : "/employer/signin");
    }
  };

  return { logout };
};
