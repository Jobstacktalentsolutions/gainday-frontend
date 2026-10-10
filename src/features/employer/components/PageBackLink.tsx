import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageBackLinkProps {
    to: string;
    children: ReactNode;
}

const PageBackLink = ({ to, children }: PageBackLinkProps) => (
    <Link to={to} className="flex w-fit items-center gap-5 text-base text-primary-950 transition-opacity hover:opacity-70">
        <ArrowLeft className="size-6 shrink-0" aria-hidden="true" />
        {children}
    </Link>
);

export default PageBackLink;