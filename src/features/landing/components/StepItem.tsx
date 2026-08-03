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
            <div className="flex w-full items-center gap-4">
                <p className={`w-7.5 shrink-0 text-2xl leading-8 ${numberColor[color]}`}>
                    {number}
                </p>
                <p className="flex-1 text-base leading-6 text-neutral-50">{text}</p>
            </div>
            {showDivider && <div className="h-px w-full bg-neutral-400/20" />}
        </div>
    );
}