import type { ClassificationCandidateComponent } from "../../types/simulation";

interface Props {
    component: ClassificationCandidateComponent;
    response: Record<string, string> | null;
    onChange: (response: Record<string, string>) => void;
}

const ClassificationAnswer = ({ component, response, onChange }: Props) => {
    const mapping = response ?? {};

    return (
        <div className="flex w-full flex-col gap-3">
            {component.items.map((item) => (
                <div
                    key={item}
                    className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#e6e6e8] px-6 py-3"
                >
                    <span className="text-[16px] text-primary-950">{item}</span>
                    <select
                        value={mapping[item] ?? ""}
                        onChange={(event) => onChange({ ...mapping, [item]: event.target.value })}
                        className="rounded-lg border border-neutral-200 px-3 py-2 text-[16px] text-neutral-700 outline-none focus:border-primary-500"
                    >
                        <option value="" disabled>
                            Choose a bucket
                        </option>
                        {component.buckets.map((bucket) => (
                            <option key={bucket} value={bucket}>
                                {bucket}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export default ClassificationAnswer;
