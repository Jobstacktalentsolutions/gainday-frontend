import { useAuthStore } from "../store/authStore";

export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken && !!user;

  return {
    user,
    accessToken,
    isAuthenticated,
  };
};
