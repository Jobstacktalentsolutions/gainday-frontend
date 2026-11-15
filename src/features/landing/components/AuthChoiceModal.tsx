import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, CandidateIcon, EmployerIcon } from "@/components/ui/icons";
import arrowTr from "@/assets/arrow-tr.svg";

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
            icon: CandidateIcon,
            label: "Sign up as candidate",
            description: "Find roles and apply",
            href: "/candidate/signup",
        },
        employer: {
            icon: EmployerIcon,
            label: "Sign up as employer",
            description: "Post and manage roles",
            href: "/employer/signup",
        },
    },
    login: {
        heading: "Log in",
        subheading: "Welcome back",
        candidate: {
            icon: CandidateIcon,
            label: "Log in as candidate",
            description: "Find roles and apply",
            href: "/candidate/signin",
        },
        employer: {
            icon: EmployerIcon,
            label: "Log in as employer",
            description: "Review your applicants",
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
                        className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl shadow-neutral-900/15 sm:p-8"
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
                        <div className="mb-6 pr-10">
                            <h2 id="auth-choice-heading" className="text-2xl font-semibold text-neutral-950">
                                {config.heading}
                            </h2>
                            <p className="mt-1 text-base text-neutral-500">{config.subheading}</p>
                        </div>

                        {/* Options */}
                        <div className="flex flex-col gap-3">
                            {[config.candidate, config.employer].map((option) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.href}
                                        type="button"
                                        onClick={() => handleSelect(option.href)}
                                        className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:gap-4 sm:p-4"
                                    >
                                        {/* Icon pill */}
                                        <span className="auth-choice-icon size-11 shrink-0 rounded-full p-0.5 shadow-sm sm:size-12">
                                            <span className="relative flex size-full items-center justify-center rounded-full bg-white text-primary-500">
                                                <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                                            </span>
                                        </span>

                                        {/* Text */}
                                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span className="text-base font-medium text-neutral-900">
                                                {option.label}
                                            </span>
                                            <span className="text-xs leading-5 text-neutral-500 sm:text-sm">
                                                {option.description}
                                            </span>
                                        </span>

                                        {/* Arrow */}
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary-500 transition-colors group-hover:bg-secondary-400 sm:size-10">
                                            <img src={arrowTr} alt="" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
                                        </span>
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
