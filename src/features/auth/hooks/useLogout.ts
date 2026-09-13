import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "../store/authStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      clearAuth();
      navigate("/employer/signin");
    }
  };

  return { logout };
};
