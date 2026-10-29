import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import brandLogo from "@/assets/gainday icon.svg";
import { Menu, X } from "lucide-react";
import { actionButtonVariants } from "@/components/ui/ActionButton";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { UserAvatarMenu } from "@/components/ui/UserAvatarMenu";
import { ViewDashboardButton } from "@/components/ui/ViewDashboardButton";
import AuthChoiceModal from "./AuthChoiceModal";


// ---------------------------------------------------------------------------
// NavItem — simple nav label (no dropdown)
// ---------------------------------------------------------------------------
interface NavItemProps {
    label: string;
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem = ({ label, href = "#", onClick }: NavItemProps) => (
    <a
        href={href}
        onClick={onClick}
        className="flex items-center gap-1 p-2.5 font-sans text-base text-neutral-700 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
    >
        {label}
    </a>
);

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
    const { user, isAuthenticated } = useCurrentUser();
    const navigate = useNavigate();

    const logoTarget = isAuthenticated
        ? user?.role === "EMPLOYER"
            ? "/employer/jobs"
            : "/job-board"
        : "/";


    const employerTarget =
        isAuthenticated && user?.role === "EMPLOYER"
            ? "/employer/jobs"
            : "/employer/signup";

    return (
        <>
        <header className="fixed top-0 left-0 z-50 w-full border-t border-t-white/25 border-b border-b-white/15 bg-white/75 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xs">

            {/* ── Top bar ── */}
            <div className="flex items-center justify-between px-6 py-4 lg:py-5 md:px-30">
                <Link
                    to={logoTarget}
                    className="shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-75 active:opacity-50"
                >
                    <img
                        src={brandLogo}
                        alt="Gainday logo"
                        className="h-12.75 w-30 lg:h-[57.6px] lg:w-34"
                    />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-2 lg:flex">
                    <NavItem
                        label="For employers"
                        href={employerTarget}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(employerTarget);
                        }}
                    />
                    <NavItem
                        label="Browse jobs"
                        href="/job-board"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/job-board");
                        }}
                    />
                    <NavItem
                        label="Pricing"
                        href="/pricing"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/pricing");
                        }}
                    />
                </nav>

                {/* Desktop auth buttons */}
                <div className="hidden items-center gap-3 lg:flex">
                    {isAuthenticated ? (
                        <>
                            <ViewDashboardButton />
                            <UserAvatarMenu />
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setAuthMode("login")}
                                className={cn(
                                    actionButtonVariants({ variant: "outline", size: "lg" }),
                                    "w-auto cursor-pointer rounded-xl px-10"
                                )}
                            >
                                Log in
                            </button>
                            <button
                                type="button"
                                onClick={() => setAuthMode("signup")}
                                className={cn(
                                    actionButtonVariants({ variant: "primary", size: "lg" }),
                                    "w-auto cursor-pointer rounded-xl px-10"
                                )}
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="flex items-center justify-center lg:hidden w-10 h-10 cursor-pointer transition-colors duration-200 hover:text-neutral-500 active:text-neutral-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>


            {/* Mobile backdrop */}
            {menuOpen && (
                <div
                    className="fixed top-full left-0 w-full h-screen bg-black/20 backdrop-blur-sm lg:hidden z-40"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Mobile accordion menu */}
            <AnimatePresence initial={false}>
                {menuOpen && (
                    <motion.nav
                        key="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="relative z-50 overflow-hidden lg:hidden border-t border-neutral-200 bg-white min-h-screen"
                    >
                        <div className="flex flex-col gap-1 px-6 py-4">
                            <Link
                                to={employerTarget}
                                onClick={() => setMenuOpen(false)}
                                className="py-3 font-sans text-base text-neutral-700 border-b border-neutral-200/50 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                            >
                                For employers
                            </Link>

                            <Link
                                to="/job-board"
                                onClick={() => setMenuOpen(false)}
                                className="py-3 font-sans text-base text-neutral-700 border-b border-neutral-200/50 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                            >
                                Browse jobs
                            </Link>

                            <Link
                                to="/pricing"
                                onClick={() => setMenuOpen(false)}
                                className="py-3 font-sans text-base text-neutral-700 border-b border-neutral-200/50 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                            >
                                Pricing
                            </Link>

                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setMenuOpen(false); setAuthMode("login"); }}
                                    className={cn(
                                        actionButtonVariants({ variant: "outline", size: "lg" }),
                                        "cursor-pointer rounded-xl"
                                    )}
                                >
                                    Log in
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMenuOpen(false); setAuthMode("signup"); }}
                                    className={cn(
                                        actionButtonVariants({ variant: "primary", size: "lg" }),
                                        "cursor-pointer rounded-xl"
                                    )}
                                >
                                    Sign up
                                </button>
                            </div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
        <AuthChoiceModal mode={authMode} onClose={() => setAuthMode(null)} onSwitchMode={(m) => setAuthMode(m)} />
        </>
    );
};

export default Header;
