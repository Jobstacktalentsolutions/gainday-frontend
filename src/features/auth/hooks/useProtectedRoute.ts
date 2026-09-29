import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "./useCurrentUser";

interface Options {
  requiredRole?: string;
  redirectTo?: string;
}

export const useProtectedRoute = ({ requiredRole, redirectTo = "/employer/signin" }: Options = {}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoadingProfile } = useCurrentUser();

  // TODO: remove before shipping — bypasses auth in dev so protected pages are reachable without login.
  if (import.meta.env.DEV) return { isAuthenticated: true, isAuthorized: true, isLoadingProfile: false };

  const isAuthorized = isAuthenticated && (!requiredRole || user?.role === requiredRole);

  useEffect(() => {
    if (isLoadingProfile) return;
    if (!isAuthorized) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthorized, isLoadingProfile, navigate, redirectTo]);

  return { isAuthenticated, isAuthorized, isLoadingProfile };
};
