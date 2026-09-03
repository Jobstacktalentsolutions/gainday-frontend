import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useProfile } from "./useProfile";

export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isAuthenticated = !!accessToken && !!user;

  const profileQuery = useProfile();

  useEffect(() => {
    if (profileQuery.data) {
      setAuth(accessToken, profileQuery.data);
    }
  }, [profileQuery.data, accessToken, setAuth]);

  useEffect(() => {
    if (profileQuery.isError) {
      clearAuth();
    }
  }, [profileQuery.isError, clearAuth]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoadingProfile: profileQuery.isLoading,
  };
};
