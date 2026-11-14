import { Link, useNavigate } from "react-router-dom";
import { actionButtonVariants } from "@/components/ui/ActionButton";
import { cn } from "@/lib/utils";

type Variant = "notFound" | "error" | "noSimulation";

const COPY: Record<Variant, { label: string; title: string; description: string }> = {
    notFound: {
        label: "Job unavailable",
        title: "This job isn't available",
        description:
            "It may have been closed or removed, or the link may be incorrect. Have a look at the open roles instead.",
    },
    error: {
        label: "Something went wrong",
        title: "We couldn't load this job",
        description: "Check your connection and try again.",
    },
    noSimulation: {
        label: "Almost ready",
        title: "This role's simulation isn't ready yet",
        description: "The employer is still setting it up. Check back soon, or look at other open roles.",
    },
};

interface JobNotFoundStateProps {
    variant?: Variant;
    onRetry?: () => void;
}

export function JobNotFoundState({ variant = "notFound", onRetry }: JobNotFoundStateProps) {
    const navigate = useNavigate();
    const copy = COPY[variant];
    const showRetry = variant === "error" && Boolean(onRetry);
    // history.length is 1 when the page was opened directly (a shared link), so there's nothing to go back to.
    const canGoBack = !showRetry && window.history.length > 1;

    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 pb-16 pt-28 text-center">
            <div className="max-w-md space-y-3">
                <p className="text-sm font-medium tracking-wide text-primary-500">{copy.label}</p>
                <h1 className="text-3xl leading-10 tracking-[-0.32px] text-primary-950 lg:text-[32px]">{copy.title}</h1>
                <p className="text-base leading-6 text-neutral-700">{copy.description}</p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                {showRetry && (
                    <button type="button" onClick={onRetry} className={cn(actionButtonVariants({ size: "lg" }), "sm:flex-1")}>
                        Try again
                    </button>
                )}
                <Link
                    to="/job-board"
                    className={cn(actionButtonVariants({ variant: showRetry ? "outline" : undefined, size: "lg" }), "sm:flex-1")}
                >
                    Browse open roles
                </Link>
                { canGoBack && (
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
}