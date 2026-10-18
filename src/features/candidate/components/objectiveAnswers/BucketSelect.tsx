import { cn } from "@/lib/utils";

interface Props {
    value: string | undefined;
    buckets: string[];
    onChange: (bucket: string) => void;
    ariaLabel: string;
    className?: string;
}

// The bucket picker shared by the standalone classification list and by table rows that take
// the choice inline, so both look and behave the same.
const BucketSelect = ({ value, buckets, onChange, ariaLabel, className }: Props) => (
    <select
        aria-label={ariaLabel}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
            "w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-700 outline-none focus:border-primary-500",
            className
        )}
    >
        <option value="" disabled>
            Choose a bucket
        </option>
        {buckets.map((bucket) => (
            <option key={bucket} value={bucket}>
                {bucket}
            </option>
        ))}
    </select>
);

export default BucketSelect;
