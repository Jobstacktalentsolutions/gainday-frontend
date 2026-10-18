import BucketSelect from "./BucketSelect";
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
                    <BucketSelect
                        value={mapping[item]}
                        buckets={component.buckets}
                        ariaLabel={`Bucket for ${item}`}
                        onChange={(bucket) => onChange({ ...mapping, [item]: bucket })}
                    />
                </div>
            ))}
        </div>
    );
};

export default ClassificationAnswer;
