import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import brandLogo from "@/assets/gainday icon.svg";
import { cn } from "@/lib/utils";
import { NavbarShell } from "@/components/ui/NavbarShell";
import { UserAvatarMenu } from "@/components/ui/UserAvatarMenu";
import { ViewDashboardButton } from "@/components/ui/ViewDashboardButton";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { CANDIDATE_NAV_LINKS } from "../utils/candidateNavLinks";
import NotificationBell from "./NotificationBell";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
        "p-2 text-sm transition-colors hover:text-primary-950",
        isActive ? "text-primary-950" : "text-neutral-700",
    );

// Header for signed-in candidates. Kept separate from the landing Header (which handles signed-out visitors,
// the promo dropdowns and the auth modal) so neither grows to carry the other's concerns.
const CandidateHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { logout } = useLogout();
    const { user } = useCurrentUser();

    const closeMenu = () => setMenuOpen(false);

    return (
        <NavbarShell mobileMenu={menuOpen && (
                <div className="flex flex-col gap-1 border-t border-neutral-200 bg-white px-6 py-4 lg:hidden">
                    <nav aria-label="Candidate" className="flex flex-col gap-1">
                        {CANDIDATE_NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    cn(
                                        "rounded-lg px-3 py-3 text-base transition-colors hover:bg-neutral-50",
                                        isActive ? "text-primary-950" : "text-neutral-700",
                                    )
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="my-2 border-t border-neutral-100" />
                    <Link
                        to="/candidate/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-base text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                        <User className="size-4 text-neutral-500" aria-hidden="true" />
                        Profile
                        {user?.isProfileComplete === false && (
                            <span className="rounded-full bg-error-500 px-2 py-0.5 text-xs font-semibold text-white">
                                Incomplete
                            </span>
                        )}
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            closeMenu();
                            void logout();
                        }}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-3 text-left text-base text-error-600 transition-colors hover:bg-error-50"
                    >
                        <LogOut className="size-4" aria-hidden="true" />
                        Log out
                    </button>
                </div>
            )}>

                <Link to="/" onClick={closeMenu} className="shrink-0">
                    <img src={brandLogo} alt="Gainday logo" className="h-auto w-22 lg:w-24" />
                </Link>

                <nav aria-label="Candidate" className="hidden items-center gap-3 lg:flex">
                    {CANDIDATE_NAV_LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} className={navLinkClass}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <NotificationBell />
                    <div className="hidden items-center gap-3 lg:flex">
                        <ViewDashboardButton />
                        <UserAvatarMenu />
                    </div>

                    <button
                        type="button"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((open) => !open)}
                        className="flex size-10 cursor-pointer items-center justify-center transition-colors hover:text-neutral-500 lg:hidden"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
        </NavbarShell>
    );
};

export default CandidateHeader;