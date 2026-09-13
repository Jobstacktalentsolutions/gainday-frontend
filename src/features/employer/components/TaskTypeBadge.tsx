interface TaskTypeBadgeProps {
  taskType?: string;
}

const formatTaskType = (taskType: string) =>
  taskType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const TaskTypeBadge = ({ taskType }: TaskTypeBadgeProps) => {
  if (!taskType) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs text-neutral-950">
      {formatTaskType(taskType)}
    </span>
  );
};

export default TaskTypeBadge;
