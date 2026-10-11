import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import brandLogo from "@/assets/gainday icon.svg";
import { cn } from "@/lib/utils";
import { UserAvatarMenu } from "@/components/ui/UserAvatarMenu";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { CANDIDATE_NAV_LINKS } from "../utils/candidateNavLinks";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
        "p-2.5 text-base transition-colors hover:text-primary-950",
        isActive ? "text-primary-950" : "text-neutral-700",
    );

// Header for signed-in candidates. Kept separate from the landing Header (which handles guests,
// the promo dropdowns and the auth modal) so neither grows to carry the other's concerns.
const CandidateHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { logout } = useLogout();

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 z-50 w-full border-t border-t-white/25 border-b border-b-white/15 bg-white/75 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xs">
            <div className="flex h-20 items-center justify-between px-6 lg:h-24.5 lg:px-12 xl:px-20">
                <Link to="/job-board" onClick={closeMenu} className="shrink-0">
                    <img src={brandLogo} alt="Gainday logo" className="h-12 w-auto lg:h-14.5" />
                </Link>

                <nav aria-label="Candidate" className="hidden items-center gap-6 lg:flex">
                    {CANDIDATE_NAV_LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} className={navLinkClass}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden lg:block">
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

            {menuOpen && (
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
            )}
        </header>
    );
};

export default CandidateHeader;