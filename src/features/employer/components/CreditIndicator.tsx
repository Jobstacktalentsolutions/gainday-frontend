import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Coins, ChevronDown, Receipt } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCreditBalance } from "../hooks/useCreditBalance";
import { formatShortDate } from "@/lib/formatDate";

const CreditIndicator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { data, isLoading } = useCreditBalance();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const lastRecharged = data?.lastRechargedAt ? formatShortDate(data.lastRechargedAt) : "Never";

    return (
        <div ref={menuRef} className="relative inline-block">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="flex items-center gap-1.5 rounded-full bg-primary-50 py-1.5 pl-2.5 pr-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100 focus:outline-hidden"
            >
                <Coins className="size-4" aria-hidden="true" />
                <span>{isLoading ? "–" : (data?.balance ?? 0)}</span>
                <ChevronDown
                    className={`size-3.5 text-primary-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur-md"
                    >
                        <p className="text-sm text-neutral-500">Credit balance</p>
                        <p className="mt-1 text-3xl font-bold text-neutral-950">{data?.balance ?? 0}</p>
                        <p className="mt-1 text-xs text-neutral-500">Last recharged: {lastRecharged}</p>

                        <Link
                            to="/employer/billing"
                            onClick={() => setIsOpen(false)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                        >
                            <Receipt className="size-4 text-neutral-500" aria-hidden="true" />
                            Billing
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreditIndicator;
