import brandLogo from "@/assets/gainday.svg"
import { actionButtonVariants } from "@/components/ui/ActionButton"
import { cn } from "@/lib/utils"
import { isChunkLoadError } from "@/lib/isChunkLoadError"
import { useAuthStore } from "@/features/auth/store/authStore"

const HOME_BY_ROLE: Record<string, { path: string; label: string }> = {
    EMPLOYER: { path: "/employer/jobs", label: "Go to my jobs" },
    JOB_SEEKER: { path: "/job-board", label: "Go to the job board" },
    ADMIN: { path: "/admin/dashboard", label: "Go to the dashboard" },
}
const DEFAULT_HOME = { path: "/landing", label: "Go to homepage" }

interface ErrorFallbackProps {
    error: Error
    reset: () => void
}

const ErrorFallback = ({ error, reset }: ErrorFallbackProps) => {
    const role = useAuthStore((state) => state.user?.role)
    const home = (role && HOME_BY_ROLE[role]) || DEFAULT_HOME
    const isStaleBundle = isChunkLoadError(error)

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-neutral-50 px-6 text-center">
            <img src={brandLogo} alt="Gainday" />

            <div role="alert" className="max-w-md space-y-3">
                <p className="text-sm font-medium tracking-wide text-primary-500">Something went wrong</p>
                <h1 className="text-3xl leading-10 tracking-[-0.32px] text-primary-950 lg:text-[32px]">
                    {isStaleBundle ? "Gainday has been updated" : "We hit an unexpected problem"}
                </h1>
                <p className="text-base leading-6 text-neutral-700">
                    {isStaleBundle
                        ? "A newer version is available. Reload the page to continue."
                        : "You can try again, or head back to a safe page. If it keeps happening, please contact support."}
                </p>
                {import.meta.env.DEV && (
                    <pre className="overflow-x-auto rounded-lg bg-white p-3 text-left text-xs text-error-600">
                        {error.message}
                    </pre>
                )}
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                {isStaleBundle ? (
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className={cn(actionButtonVariants({ size: "lg" }), "sm:flex-1")}
                    >
                        Reload page
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={reset}
                        className={cn(actionButtonVariants({ size: "lg" }), "sm:flex-1")}
                    >
                        Try again
                    </button>
                )}
                <a
                    href={home.path}
                    className={cn(actionButtonVariants({ variant: "outline", size: "lg" }), "sm:flex-1")}
                >
                    {home.label}
                </a>
            </div>
        </main>
    )
}

export default ErrorFallback