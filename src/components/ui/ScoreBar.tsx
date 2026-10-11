interface ScoreBarProps {
    /** 0–100 */
    score: number;
    label?: string;
}

const ScoreBar = ({ score, label }: ScoreBarProps) => {
    const value = Math.min(100, Math.max(0, score));

    return (
        <div
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={label}
            className="h-2 w-full overflow-hidden rounded-full bg-neutral-200"
        >
            <div className="h-full rounded-full bg-primary-500" style={{ width: `${value}%` }} />
        </div>
    );
};

export default ScoreBar;