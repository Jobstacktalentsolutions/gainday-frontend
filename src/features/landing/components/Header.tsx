import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import brandLogo from "@/assets/gainday icon.svg";
import { Menu, X, ChevronDown } from "lucide-react";
import { actionButtonVariants } from "@/components/ui/ActionButton";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { UserAvatarMenu } from "@/components/ui/UserAvatarMenu";
import AddItemButton from "@/components/ui/AddItemButton";

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
};

// ---------------------------------------------------------------------------
// NavDropdown — a nav link with an optional hover-activated dropdown panel
// ---------------------------------------------------------------------------
interface NavDropdownProps {
    label: string;
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    children?: React.ReactNode;
}

const NavDropdown = ({ label, href = "#", onClick, children }: NavDropdownProps) => {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        if (children) setOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimer.current = setTimeout(() => setOpen(false), 120);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <a
                href={href}
                onClick={onClick}
                className={cn(
                    "flex items-center gap-1 p-2.5 font-sans text-base text-neutral-700 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700",
                    open && "text-primary-500"
                )}
            >
                {label}
                {children && (
                    <ChevronDown
                        size={15}
                        className={cn(
                            "mt-0.5 shrink-0 transition-transform duration-200",
                            open && "rotate-180"
                        )}
                    />
                )}
            </a>

            <AnimatePresence>
                {open && children && (
                    <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute left-0 top-[calc(100%+4px)] min-w-[280px] rounded-2xl border border-neutral-200/80 bg-white/95 shadow-xl shadow-neutral-900/10 backdrop-blur-sm p-5 z-50"
                    >
                        {/* small arrow / notch */}
                        <div className="absolute -top-2 left-6 h-4 w-4 rotate-45 rounded-sm border-l border-t border-neutral-200/80 bg-white/95" />
                        <div className="relative">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, isAuthenticated } = useCurrentUser();
    const navigate = useNavigate();

    const logoTarget = isAuthenticated
        ? user?.role === "EMPLOYER"
            ? "/employer/dashboard"
            : "/job-board"
        : "/";

    const postJobTarget = isAuthenticated && user?.role === "EMPLOYER"
        ? "/employer/jobs/new"
        : "/employer/signup";

    return (
        <header className="fixed top-0 left-0 z-50 w-full border-t border-t-white/25 border-b border-b-white/15 bg-white/75 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xs">
            <div className="flex items-center justify-between px-6 py-4 lg:py-5 md:px-30">
                <Link to={logoTarget} className="shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-75 active:opacity-50">
                    <img
                        src={brandLogo}
                        alt="Gainday logo"
                        className="h-12.75 w-30 lg:h-[57.6px] lg:w-34"
                    />
                </Link>

                {/* ── Desktop nav ── */}
                <nav className="hidden items-center gap-2 lg:flex">
                    {/* For employers — with dropdown */}
                    <NavDropdown
                        label="For employers"
                        href="#for-employers"
                        onClick={(e) => scrollToSection(e, "#for-employers")}
                    >
                        <p className="text-sm font-medium text-neutral-600 leading-snug mb-4">
                            Post a job and get recommended the most capable candidate.
                        </p>
                        <AddItemButton onClick={() => navigate(postJobTarget)}>
                            Post Job
                        </AddItemButton>
                    </NavDropdown>

                    {/* Browse jobs — no dropdown for now */}
                    <NavDropdown label="Browse jobs" href="/job-board" onClick={(e) => { e.preventDefault(); navigate("/job-board"); }} />
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    {isAuthenticated ? (
                        <UserAvatarMenu />
                    ) : (
                        <>
                            <Link
                                to="/candidate/signin"
                                className={cn(actionButtonVariants({ variant: "outline", size: "lg" }), "w-auto rounded-xl px-10")}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/candidate/signup"
                                className={cn(actionButtonVariants({ variant: "primary", size: "lg" }), "w-auto rounded-xl px-10")}
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger button */}
                <button
                    className="flex items-center justify-center lg:hidden w-10 h-10 cursor-pointer transition-colors duration-200 hover:text-neutral-500 active:text-neutral-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop overlay */}
            {menuOpen && (
                <div
                    className="fixed top-full left-0 w-full h-screen bg-black/20 backdrop-blur-sm lg:hidden z-40"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Mobile menu accordion */}
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
                            <a
                                href="#for-employers"
                                onClick={(e) => { scrollToSection(e, "#for-employers"); setMenuOpen(false); }}
                                className="py-3 font-sans text-base text-neutral-700 border-b border-neutral-200/50 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                            >
                                For employers
                            </a>

                            {/* Mobile "Post Job" shortcut under For employers */}
                            <div className="flex items-center gap-3 py-3 border-b border-neutral-200/50">
                                <p className="text-sm text-neutral-500 flex-1">Post a job and get recommended the most capable candidate.</p>
                                <AddItemButton
                                    onClick={() => { navigate(postJobTarget); setMenuOpen(false); }}
                                    className="shrink-0 text-sm"
                                >
                                    Post Job
                                </AddItemButton>
                            </div>

                            <Link
                                to="/job-board"
                                onClick={() => setMenuOpen(false)}
                                className="py-3 font-sans text-base text-neutral-700 border-b border-neutral-200/50 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                            >
                                Browse jobs
                            </Link>

                            <div className="flex flex-col gap-3 pt-4">
                                <Link
                                    to="/candidate/signin"
                                    onClick={() => setMenuOpen(false)}
                                    className={cn(actionButtonVariants({ variant: "outline", size: "lg" }), "rounded-xl")}
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/candidate/signup"
                                    onClick={() => setMenuOpen(false)}
                                    className={cn(actionButtonVariants({ variant: "primary", size: "lg" }), "rounded-xl")}
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;

