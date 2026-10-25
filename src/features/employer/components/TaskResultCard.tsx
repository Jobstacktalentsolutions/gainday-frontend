import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Skeleton from "@/components/ui/skeleton";
import ScoreBar from "@/components/ui/ScoreBar";
import { SubmittedAnswer } from "@/features/candidate/components/SubmittedAnswer";
import type { TaskResult } from "../types/submission";

const TaskResultCard = ({ task }: { task: TaskResult }) => {
    const { score, evidence } = task;

    return (
        <article className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm uppercase text-primary-500">
                    Task {task.taskNumber}
                    {task.weight !== undefined ? ` · Weight ${task.weight}%` : ""}
                </p>
                {score !== null ? (
                    <p className="text-2xl font-bold text-neutral-900">{score}/100</p>
                ) : (
                    <p className="text-sm text-neutral-500">Not graded</p>
                )}
            </div>
            <h3 className="text-2xl leading-8 text-neutral-900">{task.title}</h3>
            {score !== null && <ScoreBar score={score} label={`${task.title} score`} />}

            <div className="prose prose-sm max-w-none text-neutral-700 prose-p:my-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.questionPrompt}</ReactMarkdown>
            </div>

            <SubmittedAnswer task={task} answer={task.answer} />

            {task.gateTriggered === true && (
                <div role="alert" className="flex flex-col gap-1 border border-error-200 bg-error-50 p-3 text-base">
                    <p className="font-medium text-error-700">Gate triggered: judgment capped at 20</p>
                    <p className="text-error-700">The response did what this task's gate forbids. Review the answer before deciding.</p>
                </div>
            )}

            {task.checklist !== null && task.checklist.length > 0 && (
                <div className="flex flex-col gap-2 text-base">
                    <p className="text-neutral-500">Checklist</p>
                    <ul className="flex flex-col gap-1.5">
                        {task.checklist.map((mark) => (
                            <li key={mark.item} className="flex flex-col gap-0.5">
                                <span className={mark.met ? "text-success-700" : "text-error-700"}>
                                    {mark.met ? "Met" : "Not met"}: <span className="text-neutral-800">{mark.item}</span>
                                </span>
                                {mark.evidence && <span className="text-sm text-neutral-500">“{mark.evidence}”</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {evidence !== null && (
                <div className="flex flex-col gap-1 bg-neutral-50 p-3 text-base">
                    <p className="text-neutral-500">Reviewer Notes</p>
                    <p className="text-neutral-700">{evidence}</p>
                </div>
            )}
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
