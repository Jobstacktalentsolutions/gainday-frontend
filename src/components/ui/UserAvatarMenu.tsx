import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface UserAvatarMenuProps {
  className?: string;
}

export const UserAvatarMenu = ({ className }: UserAvatarMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { logout } = useLogout();

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    const name = user?.fullName || user?.companyName || user?.email || "User";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    if (user?.role === "EMPLOYER") {
      navigate("/employer/profile");
    } else if (user?.role === "CANDIDATE") {
      navigate("/candidate/profile");
    } else {
      navigate("/profile");
    }
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const userDisplayName = user?.fullName || user?.companyName || "Account";
  const userEmail = user?.email || "";

  return (
    <div ref={menuRef} className={`relative inline-block ${className || ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 transition-all hover:bg-neutral-100/80 focus:outline-hidden"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white shadow-xs">
          {getInitials()}
        </div>
        <ChevronDown className={`size-4 text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-neutral-200 bg-white/95 p-2 shadow-xl backdrop-blur-md z-50"
          >
            {/* User Info Header */}
            <div className="border-b border-neutral-100 px-3 py-3">
              <p className="truncate text-sm font-bold text-neutral-900">{userDisplayName}</p>
              {userEmail && <p className="truncate text-xs text-neutral-500">{userEmail}</p>}
              {user?.role && (
                <span className="mt-1.5 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-600 uppercase tracking-wider">
                  {user.role}
                </span>
              )}
            </div>

            {/* Menu Options */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleProfileClick}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
              >
                <User className="size-4 text-neutral-500" />
                Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="size-4 text-red-500" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
