import { InterfaceType } from "@/features/simulation-tasks/types";

interface TaskTypeBadgeProps {
  taskType?: string;
  interfaceType?: InterfaceType;
}

const formatTaskType = (taskType: string) =>
  taskType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Color groups objective-style tasks (structured/table response) separately from open-ended
// ones (rich text / plain text response) — a proxy for the underlying component-type split
// since `taskType` itself is a free-form string from the backend's role modules.
const OBJECTIVE_STYLE = "bg-success-50 text-neutral-950";
const OPEN_ENDED_STYLE = "bg-primary-50 text-neutral-950";

const TaskTypeBadge = ({ taskType, interfaceType }: TaskTypeBadgeProps) => {
  if (!taskType) return null;
  const className =
    interfaceType === InterfaceType.TABLE_VIEW_RESPONSE_PANEL ? OBJECTIVE_STYLE : OPEN_ENDED_STYLE;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${className}`}>
      {formatTaskType(taskType)}
    </span>
  );
};

export default TaskTypeBadge;
