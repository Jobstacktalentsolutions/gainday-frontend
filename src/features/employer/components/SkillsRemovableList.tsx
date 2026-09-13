import { X } from "lucide-react";

interface SkillsRemovableListProps {
  value: string[];
  onChange: (skills: string[]) => void;
}

const SkillsRemovableList = ({ value, onChange }: SkillsRemovableListProps) => {
  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill));
  };

  if (value.length === 0) {
    return <p className="text-sm text-neutral-400">No skills recorded.</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5">
      {value.map((skill) => (
        <span
          key={skill}
          className="flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-sm text-primary-600"
        >
          {skill}
          <button
            type="button"
            onClick={() => removeSkill(skill)}
            aria-label={`Remove ${skill}`}
            className="text-primary-400 hover:text-primary-600"
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
};

export default SkillsRemovableList;