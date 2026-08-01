import { Link } from "react-router-dom";
import brandLogo from "@/assets/gainday icon.svg";

const navLinks = [
    { label : "For employers", href: "#for-employers"},
    { label : "For candidates", href : "for-candidates"},
    { label : "Open Roles", href : "#open-roles"},
]


const Header = () => {
    return(
        <header>
            <Link to = "/" className = "shrink-0">
                <img
                src= {brandLogo}
                alt = "Gainday logo"
                className="h-12.75 w-30 md:h-[57.6px] md:w-34"
                />
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
                {navLinks.map((link) => (
                    <a
                    key = {link.href}
                    href = {link.href}
                    className = "p-2.5 font-sans text-base text-neutral-700"
                    >
                        {link.label}
                    </a>
                ))}
            </nav>

            <div className = "hidden items-center gap-3 md:flex">
                <a
                href = "#post-a-job"
                className="flex h-13 items-center justify-center rounded-xl border border-primary-500 px-10 py-2 font-sans"
                >
                    Post a Job
                </a>

            </div>
        </header>
    );
}