import useCountUp from "@/lib/motion/useCountUp";

interface Stat {
    value: string;
    label: string;
    /** Count down from this number instead of up from 0. */
    from?: number;
}

const stats: Stat[] = [
    { value: "318+", label: "Applications in 48hrs" },
    { value: "£0", label: "to post a role", from: 15 },
    { value: "95%", label: "Faster Hiring" },
];

const StatItem = ({ value, label, from }: Stat) => {
    const { ref, display } = useCountUp(value, 1.5, from);

    return (
        <div className="flex w-30 flex-col items-center justify-center gap-0.5 lg:w-38">
            <p ref={ref} className="stat-number tabular-nums text-black">
                {display}
            </p>
            <p className="text-center text-base leading-6 text-neutral-700">{label}</p>
        </div>
    );
};

export function StatsRow() {
    return (
        <div className="flex items-start justify-center gap-2 lg:gap-5">
            {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
            ))}
        </div>
    );
}