import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, Briefcase, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthChoiceModalProps {
    mode: "login" | "signup" | null;
    onClose: () => void;
    onSwitchMode: (mode: "login" | "signup") => void;
}

const OPTIONS = {
    signup: {
        heading: "Sign up",
        subheading: "How would you like to get started?",
        candidate: {
            icon: Sparkles,
            label: "I'm looking for a job",
            description: "Prove your skills through real tasks and land roles that match your true ability.",
            href: "/candidate/signup",
        },
        employer: {
            icon: Briefcase,
            label: "I'm hiring talent",
            description: "Post a role and let Gainday surface the most capable candidates, ranked by evidence.",
            href: "/employer/signup",
        },
    },
    login: {
        heading: "Log in",
        subheading: "Welcome back",
        candidate: {
            icon: Sparkles,
            label: "I'm a candidate",
            description: "Continue where you left off and track your Capability Passport.",
            href: "/candidate/signin",
        },
        employer: {
            icon: Briefcase,
            label: "I'm an employer",
            description: "Review submissions and manage your active roles.",
            href: "/employer/signin",
        },
    },
};

const AuthChoiceModal = ({ mode, onClose, onSwitchMode }: AuthChoiceModalProps) => {
    const navigate = useNavigate();
    const config = mode ? OPTIONS[mode] : null;

    const handleSelect = (href: string) => {
        onClose();
        navigate(href);
    };

    return (
        <AnimatePresence>
            {mode && config && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="auth-choice-heading"
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/15 p-8"
                    >
                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-5 top-5 flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        >
                            <X size={18} />
                        </button>

                        {/* Heading */}
                        <div className="mb-8">
                            <h2 id="auth-choice-heading" className="text-2xl font-semibold text-neutral-950">
                                {config.heading}
                            </h2>
                            <p className="mt-1 text-base text-neutral-500">{config.subheading}</p>
                        </div>

                        {/* Options */}
                        <div className="flex flex-col divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200">
                            {[config.candidate, config.employer].map((option) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.href}
                                        type="button"
                                        onClick={() => handleSelect(option.href)}
                                        className={cn(
                                            "group flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-primary-50",
                                        )}
                                    >
                                        {/* Icon pill */}
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-100">
                                            <Icon size={18} />
                                        </span>

                                        {/* Text */}
                                        <span className="flex flex-1 flex-col gap-0.5">
                                            <span className="text-base font-medium text-neutral-900">
                                                {option.label}
                                            </span>
                                            <span className="text-sm text-neutral-500">
                                                {option.description}
                                            </span>
                                        </span>

                                        {/* Arrow */}
                                        <ArrowRight
                                            size={16}
                                            className="shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-500"
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer toggle */}
                        <p className="mt-6 text-center text-sm text-neutral-500">
                            {mode === "signup" ? (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => onSwitchMode("login")}
                                        className="cursor-pointer font-medium text-primary-500 hover:underline"
                                    >
                                        Log in
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => onSwitchMode("signup")}
                                        className="cursor-pointer font-medium text-primary-500 hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </>
                            )}
                        </p>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthChoiceModal;
