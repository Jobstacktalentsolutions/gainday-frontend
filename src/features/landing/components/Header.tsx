import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import brandLogo from "@/assets/gainday icon.svg";
import { Menu, X, ChevronDown, BookOpen, Briefcase } from "lucide-react";
import { actionButtonVariants } from "@/components/ui/ActionButton";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { UserAvatarMenu } from "@/components/ui/UserAvatarMenu";
import AddItemButton from "@/components/ui/AddItemButton";
import { StepContinueButton } from "@/components/ui/StepNavigationButtons";

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
};

// ---------------------------------------------------------------------------
// NavItem — simple nav label; chevron state + dropdown are owned by Header
// ---------------------------------------------------------------------------
interface NavItemProps {
    label: string;
    href?: string;
    isOpen?: boolean;
    hasDropdown?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface NavItemDropdownProps extends NavItemProps {
    dropdownContent?: React.ReactNode;
}

const NavItem = ({
    label,
    href = "#",
    isOpen = false,
    hasDropdown = false,
    onMouseEnter,
    onMouseLeave,
    onClick,
    dropdownContent,
}: NavItemDropdownProps) => (
    <div
        className="relative"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <a
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-1 p-2.5 font-sans text-base text-neutral-700 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700",
                isOpen && "text-primary-500"
            )}
        >
            {label}
            {hasDropdown && (
                <ChevronDown
                    size={15}
                    className={cn(
                        "mt-0.5 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            )}
        </a>

        {/* Fixed-width dropdown panel anchored below this nav item */}
        <AnimatePresence>
            {isOpen && dropdownContent && (
                <motion.div
                    key="employer-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-0 top-[calc(100%+32px)] rounded-2xl border w-80 border-neutral-200/80 bg-white shadow-xl shadow-neutral-900/10 overflow-hidden z-50"
                >
                    {dropdownContent}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [employerDropOpen, setEmployerDropOpen] = useState(false);
    const [browseJobsDropOpen, setBrowseJobsDropOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const browseCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { user, isAuthenticated } = useCurrentUser();
    const navigate = useNavigate();

    const logoTarget = isAuthenticated
        ? user?.role === "EMPLOYER"
            ? "/employer/dashboard"
            : "/job-board"
        : "/";

    const postJobTarget =
        isAuthenticated && user?.role === "EMPLOYER"
            ? "/employer/jobs/new"
            : "/employer/signup";

    const openEmployerDrop = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setEmployerDropOpen(true);
    };

    const closeEmployerDrop = () => {
        closeTimer.current = setTimeout(() => setEmployerDropOpen(false), 120);
    };

    const openBrowseJobsDrop = () => {
        if (browseCloseTimer.current) clearTimeout(browseCloseTimer.current);
        setBrowseJobsDropOpen(true);
    };

    const closeBrowseJobsDrop = () => {
        browseCloseTimer.current = setTimeout(() => setBrowseJobsDropOpen(false), 120);
    };

    return (
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
                        href="#for-employers"
                        isOpen={employerDropOpen}
                        hasDropdown
                        onMouseEnter={openEmployerDrop}
                        onMouseLeave={closeEmployerDrop}
                        onClick={(e) => scrollToSection(e, "#for-employers")}
                        dropdownContent={
                            <div className="p-7">
                                {/* Promo text */}
                                <p className="text-xl text-neutral-950 leading-snug mb-6">
                                    Post a job and get recommended the most capable candidate.
                                </p>

                                {/* CTA */}
                                <AddItemButton onClick={() => navigate(postJobTarget)}>
                                    Post a Job
                                </AddItemButton>

                                {/* Divider + footer link */}
                                <div className="mt-6 pt-5 border-t border-neutral-200">
                                    <a
                                        href="#assessment-process"
                                        onClick={(e) => scrollToSection(e, "#assessment-process")}
                                        className="inline-flex items-start gap-2.5 text-base text-neutral-500 transition-colors duration-200 hover:text-primary-500 cursor-pointer group"
                                    >
                                        <BookOpen
                                            size={18}
                                            className="shrink-0 relative top-1 text-neutral-400 group-hover:text-primary-500 transition-colors duration-200"
                                        />
                                        Learn more about the candidate assessment process
                                    </a>
                                </div>
                            </div>
                        }
                    />
                    <NavItem
                        label="Browse jobs"
                        href="/job-board"
                        isOpen={browseJobsDropOpen}
                        hasDropdown
                        onMouseEnter={openBrowseJobsDrop}
                        onMouseLeave={closeBrowseJobsDrop}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/job-board");
                        }}
                        dropdownContent={
                            <div className="p-7">
                                {/* Promo text */}
                                <p className="text-xl text-neutral-950 leading-snug mb-6">
                                    Discover roles matched to your skills and start your next chapter.
                                </p>

                                {/* CTA */}
                                <StepContinueButton
                                    size="lg"
                                    className="w-full"
                                    onClick={() => navigate("/job-board")}
                                >
                                    Go to Job Board
                                </StepContinueButton>

                                {/* Divider + footer link */}
                                <div className="mt-6 pt-5 border-t border-neutral-200">
                                    <a
                                        href="/candidate/signup"
                                        onClick={(e) => { e.preventDefault(); navigate("/candidate/signup"); }}
                                        className="inline-flex items-start gap-2.5 text-base text-neutral-500 transition-colors duration-200 hover:text-primary-500 cursor-pointer group"
                                    >
                                        <Briefcase
                                            size={18}
                                            className="shrink-0 relative top-1 text-neutral-400 group-hover:text-primary-500 transition-colors duration-200"
                                        />
                                        Create a free account to apply for jobs
                                    </a>
                                </div>
                            </div>
                        }
                    />
                </nav>

                {/* Desktop auth buttons */}
                <div className="hidden items-center gap-3 lg:flex">
                    {isAuthenticated ? (
                        <UserAvatarMenu />
                    ) : (
                        <>
                            <Link
                                to="/candidate/signin"
                                className={cn(
                                    actionButtonVariants({ variant: "outline", size: "lg" }),
                                    "w-auto rounded-xl px-10"
                                )}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/candidate/signup"
                                className={cn(
                                    actionButtonVariants({ variant: "primary", size: "lg" }),
                                    "w-auto rounded-xl px-10"
                                )}
                            >
                                Sign up
                            </Link>
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
                            <a
                                href="#for-employers"
                                onClick={(e) => {
                                    scrollToSection(e, "#for-employers");
                                    setMenuOpen(false);
                                }}
                                className="py-3 font-sans text-base text-neutral-700 border-b border-neutral-200/50 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                            >
                                For employers
                            </a>

                            {/* Mobile Post Job */}
                            <div className="flex items-center gap-3 py-3 border-b border-neutral-200/50">
                                <p className="text-sm text-neutral-500 flex-1">
                                    Post a job and get recommended the most capable candidate.
                                </p>
                                <AddItemButton
                                    onClick={() => {
                                        navigate(postJobTarget);
                                        setMenuOpen(false);
                                    }}
                                    className="shrink-0 text-sm"
                                >
                                    Post Job
                                </AddItemButton>
                            </div>

                            {/* Mobile Learn more */}
                            <a
                                href="#assessment-process"
                                onClick={(e) => {
                                    scrollToSection(e, "#assessment-process");
                                    setMenuOpen(false);
                                }}
                                className="flex items-center gap-2 py-3 text-sm text-neutral-500 border-b border-neutral-200/50 cursor-pointer hover:text-primary-500 transition-colors duration-200"
                            >
                                <BookOpen size={15} className="shrink-0" />
                                Learn more about the candidate assessment process
                            </a>

                            <Link
                                to="/job-board"
                                onClick={() => setMenuOpen(false)}
                                className="py-3 font-sans text-base text-neutral-700 border-b border-neutral-200/50 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                            >
                                Browse jobs
                            </Link>

                            {/* Mobile Browse Jobs CTA */}
                            <div className="flex items-center gap-3 py-3 border-b border-neutral-200/50">
                                <p className="text-sm text-neutral-500 flex-1">
                                    Discover roles matched to your skills.
                                </p>
                                <StepContinueButton
                                    size="md"
                                    className="shrink-0"
                                    onClick={() => {
                                        navigate("/job-board");
                                        setMenuOpen(false);
                                    }}
                                >
                                    View Jobs
                                </StepContinueButton>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <Link
                                    to="/candidate/signin"
                                    onClick={() => setMenuOpen(false)}
                                    className={cn(
                                        actionButtonVariants({ variant: "outline", size: "lg" }),
                                        "rounded-xl"
                                    )}
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/candidate/signup"
                                    onClick={() => setMenuOpen(false)}
                                    className={cn(
                                        actionButtonVariants({ variant: "primary", size: "lg" }),
                                        "rounded-xl"
                                    )}
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
