// src/features/employer/components/TaskTypeBadge.tsx
import type { TaskType } from "../schemas/jobPosting";

const TYPE_STYLES: Record<TaskType, { label: string; className: string }> = {
  written: { label: "written", className: "bg-primary-50 text-neutral-950" },
  choice: { label: "choice", className: "bg-success-50 text-neutral-950" },
};

interface TaskTypeBadgeProps {
  type: TaskType;
}

const TaskTypeBadge = ({ type }: TaskTypeBadgeProps) => {
  const { label, className } = TYPE_STYLES[type];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${className}`}>
      {label}
    </span>
  );
};

export default TaskTypeBadge;