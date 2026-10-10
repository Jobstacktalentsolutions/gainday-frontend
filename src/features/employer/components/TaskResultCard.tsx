import Skeleton from "@/components/ui/skeleton";
import ScoreBar from "./ScoreBar";
import type { TaskResult } from "../types/submission";

const TaskResultCard = ({ task }: { task: TaskResult }) => {
    return (
        <article className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm uppercase text-primary-500">Task {task.taskNumber}</p>
                <p className="text-2xl font-bold text-neutral-900">{task.score}/100</p>
            </div>
            <h3 className="text-2xl leading-8 text-neutral-900">{task.title}</h3>
            <ScoreBar score={task.score} label={`${task.title} score`} />
            <div className="flex flex-col gap-1 bg-neutral-50 p-3 text-base">
                <p className="text-neutral-500">EVIDENCE FROM ANSWER</p>
                <p className="text-neutral-700">{task.evidence}</p>
            </div>
        </article>
    );
};

export const TaskResultCardSkeleton = () => {
    return (
        <div className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-7 w-20" />
            </div>
            <Skeleton className="h-8 w-72 max-w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    );
};

export default TaskResultCard;