import { Link, useNavigate } from "react-router-dom";
import brandLogo from "@/assets/gainday.svg";
import { actionButtonVariants } from "@/components/ui/ActionButton";
import { cn } from "@/lib/utils";

const NotFoundPage = () => {
    const navigate = useNavigate();
    // history.length is 1 when the page was opened directly (e.g. from an email).
    const canGoBack = window.history.length > 1;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-neutral-50 px-6 text-center">
            <Link to="/landing" aria-label="Gainday home">
                <img src={brandLogo} alt="Gainday" />
            </Link>

            <div className="max-w-md space-y-3">
                <p className="text-sm font-medium tracking-wide text-primary-500">404</p>
                <h1 className="text-3xl leading-10 tracking-[-0.32px] text-primary-950 lg:text-[32px]">
                    This page doesn't exist
                </h1>
                <p className="text-base leading-6 text-neutral-700">
                    The link may be broken or the page may have moved. If you followed a link from an
                    email, try signing in and opening it again.
                </p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                <Link
                    to="/landing"
                    className={cn(actionButtonVariants({ size: "lg" }), "sm:flex-1")}
                >
                    Go to homepage
                </Link>
                {canGoBack && (
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className={cn(actionButtonVariants({ variant: "outline", size: "lg" }), "sm:flex-1")}
                    >
                        Go back
                    </button>
                )}
            </div>
        </main>
    );
};

export default NotFoundPage;
