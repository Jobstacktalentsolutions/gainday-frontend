import { useEffect, useRef, useState } from "react";
import { Coins, ChevronDown } from "lucide-react";
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
                        className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-neutral-200 bg-white/95 p-3 shadow-lg backdrop-blur-md"
                    >
                        <p className="text-xs font-medium text-neutral-500">Credit balance</p>
                        <p className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-950">{data?.balance ?? 0}</p>
                        <p className="mt-1 text-[11px] text-neutral-500">Last recharged: {lastRecharged}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreditIndicator;
