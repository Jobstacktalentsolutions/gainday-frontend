import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import brandLogo from "@/assets/gainday icon.svg";
import { Menu, X } from "lucide-react";

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
}

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 z-50 w-full border-t border-t-white/25 border-b border-b-white/15 bg-white/75 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xs">
            <div className="flex items-center justify-between px-6 py-4 lg:py-5 md:px-30">
                <Link to="/" className="shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-75 active:opacity-50">
                    <img
                        src={brandLogo}
                        alt="Gainday logo"
                        className="h-12.75 w-30 lg:h-[57.6px] lg:w-34"
                    />
                </Link>

                <nav className="hidden items-center gap-6 lg:flex">
                    <a
                        href="#for-employers"
                        onClick={(e) => scrollToSection(e, "#for-employers")}
                        className="p-2.5 font-sans text-base text-neutral-700 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                    >
                        For employers
                    </a>
                    <Link
                        to="/job-board"
                        className="p-2.5 font-sans text-base text-neutral-700 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                    >
                        Browse jobs
                    </Link>
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <Link
                        to="/login"
                        className="flex h-13 items-center justify-center rounded-xl border border-primary-500 px-10 py-2 font-sans text-[16px] text-primary-500 cursor-pointer transition-all duration-300 hover:bg-primary-50 active:scale-95"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/signup"
                        className="flex h-13 items-center justify-center rounded-xl bg-primary-500 px-10 py-2 text-base text-neutral-50 whitespace-nowrap cursor-pointer transition-all duration-200 hover:bg-primary-600 active:scale-95"
                    >
                        Sign up
                    </Link>
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
                            <Link
                                to="/job-board"
                                onClick={() => setMenuOpen(false)}
                                className="py-3 font-sans text-base text-neutral-700 border-b border-neutral-200/50 cursor-pointer transition-colors duration-200 hover:text-primary-500 active:text-primary-700"
                            >
                                Browse jobs
                            </Link>

                            <div className="flex flex-col gap-3 pt-4">
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex h-13 items-center justify-center rounded-xl border border-primary-500 px-10 py-2 font-sans text-[16px] text-primary-500 cursor-pointer transition-all duration-200 hover:bg-primary-50 active:scale-95"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex h-13 items-center justify-center rounded-xl bg-primary-500 px-10 py-2 text-base text-neutral-50 cursor-pointer transition-all duration-200 hover:bg-primary-600 active:scale-95"
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
}

export default Header;

