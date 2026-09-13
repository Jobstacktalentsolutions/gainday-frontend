interface StepItemProps {
    number: string;
    text: string;
    color: "secondary" | "info";
    showDivider?: boolean;
}

const numberColor = {
    secondary: "text-secondary-500",
    info: "text-info-500"
}

export function StepItem({ number, text, color, showDivider = true }: StepItemProps) {
    return (
        <div className="flex w-full flex-col items-start gap-3">
            <div className="flex w-full items-center gap-4 lg:gap-10">
                <p className={`w-7.5 shrink-0 text-2xl leading-8 lg:w-14 lg:text-[48px] lg:leading-14.5 lg:tracking-[-0.48px] ${numberColor[color]}`}>
                    {number}
                </p>
                <p className="flex-1 text-base leading-6 text-neutral-50 lg:text-lg lg:leading-[1.2]">{text}</p>
            </div>
            {showDivider && <div className="h-px w-full bg-neutral-400/20" />}
        </div>
    );
}