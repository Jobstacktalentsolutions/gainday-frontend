import { useState } from "react";
import { Menu } from "@/components/ui/icons";
import { Link } from "react-router-dom";
import EmployerNavDrawer from "./EmployerNavDrawer";
import CreditIndicator from "./CreditIndicator";
import BrandLogo from "@/assets/gainday icon.svg";
import { UserAvatarMenu } from "@/components/ui/UserAvatarMenu";
import { NavbarLinks } from "@/components/ui/NavbarLinks";
import { NavbarShell } from "@/components/ui/NavbarShell";
import { EMPLOYER_NAV_LINKS } from "../utils/employerNavLinks";

const EmployerTopNav = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <NavbarShell>
                {/* Left: Brand logo */}
                <Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
                    <img
                        src={BrandLogo}
                        alt="Gainday logo"
                        className="h-auto w-22 lg:w-24"
                    />
                </Link>

                <NavbarLinks label="Employer" links={EMPLOYER_NAV_LINKS} />

                {/* Right: credit balance + avatar dropdown (desktop) + hamburger (mobile) */}
                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-3 lg:flex">
                        <CreditIndicator />
                        <UserAvatarMenu />
                    </div>

                    {/* Hamburger: mobile only */}
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        aria-label="Open menu"
                        className="flex size-6 items-center justify-center lg:hidden"
                    >
                        <Menu className="size-6 text-neutral-950" aria-hidden="true" />
                    </button>
                </div>
            </NavbarShell>
            <EmployerNavDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
        </>
    );
}

export default EmployerTopNav;