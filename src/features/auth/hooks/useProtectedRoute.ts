import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "./useCurrentUser";

export const useProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();

  useEffect(() => {
    // TODO: Enable auth check and redirect to signin
    // Functionality added, redirect commented out for now
    if (!isAuthenticated) {
      // Redirect to sign in when not authenticated
      // navigate("/employer/signin");
      console.warn("User not authenticated, should redirect to signin");
    }
  }, [isAuthenticated, navigate]);

  return { isAuthenticated };
};
