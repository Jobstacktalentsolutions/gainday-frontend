import { Link } from "react-router-dom";

interface AuthSwitchLinkProps {
    prompt: string;
    linkText: string;
    to: string;
}

const AuthSwitchLink = ({ prompt, linkText, to }: AuthSwitchLinkProps) => {
    return (
        <p className="text-center text-base text-neutral-700">
            {prompt} {" "}
            <Link to={to} className="text-primary-500">
                {linkText}
            </Link>

        </p>
    )
}

export default AuthSwitchLink;