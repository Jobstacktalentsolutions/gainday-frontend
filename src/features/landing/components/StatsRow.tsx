import useCountUp from "@/lib/motion/useCountUp";

interface Stat {
    value: string;
    label: string;
}


const stats: Stat[] = [
    { value: "318+", label: "Applications in 48hrs" },
    { value: "#1", label: "Predictive Validity" },
    { value: "95%", label: "Faster Hiring" },
]


const StatItem = ({ value, label }: Stat) => {

    const { ref, display } = useCountUp(value);

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
            <p
                ref={ref}
                className="text-[28px] leading-14.5 tracking-[-0.48px] text-black"
            >
                {display}
            </p>
            <p className="text-base text-center leading-6 text-neutral-700">{label}</p>

        </div>
    );

}

export function StatsRow() {
    return (
        <div className="flex justify-center items-center gap-[34.5px]">
            {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
            ))}
        </div>
    );
}