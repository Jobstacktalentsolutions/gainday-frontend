import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useProfile } from "../hooks/useProfile";
import { getMissingProfileFields } from "../utils/profileCompletion";
import { AUTH_ROLES } from "../utils/roles";

const PROMPT_KEY = "gainday-profile-prompt";

export function ProfilePrompt() {
  const { user, isAuthenticated } = useCurrentUser();
  const profile = useProfile();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const missing = user ? getMissingProfileFields(user) : [];

  useEffect(() => {
    if (!isAuthenticated || !user || !profile.data || localStorage.getItem(PROMPT_KEY) !== user.email.trim().toLowerCase()) return;
    localStorage.removeItem(PROMPT_KEY);
    if (getMissingProfileFields(profile.data).length > 0) setOpen(true);
  }, [isAuthenticated, user, profile.data]);

  const profilePath = user?.role === AUTH_ROLES.employer ? "/employer/profile" : "/candidate/profile";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
          <DialogDescription>
            Add your {missing.join(" and ")} to remove the profile warning. You can do this later.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <ActionButton variant="outline" onClick={() => setOpen(false)}>Skip for now</ActionButton>
          <ActionButton onClick={() => { setOpen(false); navigate(profilePath); }}>Go to profile</ActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
