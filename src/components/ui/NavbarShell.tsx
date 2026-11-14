import type { ReactNode } from "react";

interface NavbarShellProps {
    children: ReactNode;
    mobileMenu?: ReactNode;
}

export function NavbarShell({ children, mobileMenu }: NavbarShellProps) {
    return (
        <header className="fixed top-0 left-0 z-50 w-full border-b border-white/30 bg-white/70 backdrop-blur-md">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-2">
                {children}
            </div>
            {mobileMenu}
        </header>
    );
}
