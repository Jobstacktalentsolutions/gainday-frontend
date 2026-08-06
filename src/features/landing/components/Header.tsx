import { Link } from "react-router-dom";
import brandLogo from "@/assets/gainday icon.svg";

const navLinks = [
    { label: "For employers", href: "#for-employers" },
    { label: "For candidates", href: "for-candidates" },
    { label: "Open Roles", href: "#open-roles" },
]


const Header = () => {
    return (
        <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-t border-t-white/25 border-b border-b-white/15 bg-white/10 px-6 py-4 lg:py-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xs md:px-30">
            <Link to="/" className="shrink-0">
                <img
                    src={brandLogo}
                    alt="Gainday logo"
                    className="h-12.75 w-30 md:h-[57.6px] md:w-34"
                />
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
                {navLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="p-2.5 font-sans text-base text-neutral-700"
                    >
                        {link.label}
                    </a>
                ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
                <a
                    href="#post-a-job"
                    className="flex h-13 items-center justify-center rounded-xl border border-primary-500 px-10 py-2 font-sans"
                >
                    Post a Job
                </a>
                <a
                    href="#try-a-challenge"
                    className="flex h-13 w-37.75 items-center justify-center rounded-xl bg-primary-500 px-10 py-2 text-base text-neutral-50"
                >
                    Try a challenge
                </a>
            </div>
        </header>
    );
}

export default Header;