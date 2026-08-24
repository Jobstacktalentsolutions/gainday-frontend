import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = () => {
    clearAuth();
    navigate("/employer/signin");
  };

  return { logout };
};
