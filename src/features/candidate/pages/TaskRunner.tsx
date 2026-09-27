import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CloudUpload, Timer } from "lucide-react";
import { PublicNavbar } from "../components/PublicNavbar";
import { ActionButton } from "@/components/ui/ActionButton";
import { useJobDetails } from "../hooks/useJobDetails";
import { useJobSimulation } from "../hooks/useJobSimulation";
import { useSimulationRunStore } from "../store/useSimulationRunStore";
import { useSimulationTimer } from "../hooks/useSimulationTimer";
import { useConnectionMonitor } from "../hooks/useConnectionMonitor";
import { useAutosaveAnswer } from "../hooks/useAutosaveAnswer";
import { useTabVisibilityGuard } from "../hooks/useTabVisibilityGuard";
import { useSimulationIntegrityStore } from "../hooks/useSimulationIntegrityStore";
import { TaskObjectiveOptions } from "../components/TaskObjectiveOptions";
import { TaskResponseInput } from "../components/TaskResponseInput";
import { TimeWarningBanner } from "../components/TimeWarningBanner";
import { ConnectionBanner } from "../components/ConnectionBanner";
import { SimulationCompleteModal } from "../components/SimulationCompleteModal";



export default function TaskRunner() {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { job } = useJobDetails(jobId);
    const { data: simulation } = useJobSimulation(job);

    const runStore = useSimulationRunStore();
    const addFlag = useSimulationIntegrityStore((state) => state.addFlag);
    const { scheduleSave, isSaving } = useAutosaveAnswer();
    const connection = useConnectionMonitor();

    const { arm } = useTabVisibilityGuard({
        onViolation: (reason) => addFlag(`task-${runStore.currentTaskIndex}-${reason}`),
    });
    useEffect(() => {
        arm(); // arm after mount — calling arm() during render triggers setStatus → infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (job && simulation) runStore.startRun(job.id, simulation.id, simulation.timeLimitMinutes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [job?.id, simulation?.id]);

    const timer = useSimulationTimer(runStore.endTimestamp);

    useEffect(() => {
        if (timer.isExpired && !runStore.isComplete) runStore.markComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer.isExpired, runStore.isComplete]);

    const [connectionBannerDismissed, setConnectionBannerDismissed] = useState(false);
    useEffect(() => {
        if (connection.status === "lost") setConnectionBannerDismissed(false);
    }, [connection.status]);

    if (!job || !simulation) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-700">Loading...</div>
        );
    }

    const task = simulation.tasks[runStore.currentTaskIndex];
    const answer = runStore.answers[task.id] ?? { selectedOptionIndex: null, textResponse: "" };
    const isLastTask = runStore.currentTaskIndex === simulation.tasks.length - 1;

    function updateAnswer(patch: Partial<typeof answer>) {
        runStore.setAnswer(task.id, patch);
        scheduleSave({
            taskId: task.id,
            selectedOptionIndex: patch.selectedOptionIndex ?? answer.selectedOptionIndex,
            textResponse: patch.textResponse ?? answer.textResponse,
        });
    }

    function handleNext() {
        if (isLastTask) {
            runStore.markComplete();
            return;
        }
        runStore.advanceTask();
    }

    if (runStore.isComplete) {
        return <SimulationCompleteModal timeLimitMinutes={simulation.timeLimitMinutes} />;
    }

    const progressPercent = ((runStore.currentTaskIndex + 1) / simulation.tasks.length) * 100;

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <PublicNavbar />

            {timer.isWarning && <TimeWarningBanner />}
            {!timer.isWarning && connection.status !== "online" && !(connection.status === "restored" && connectionBannerDismissed) && (
                <ConnectionBanner
                    status={connection.status as "lost" | "restored"}
                    onDismiss={() => setConnectionBannerDismissed(true)}
                />
            )}

            {/* header — mirrors PublicNavbar's height/blur so it stacks cleanly */}
            <div className="fixed left-0 top-0 z-10 flex h-[117px] w-full items-center justify-between border-b-[0.5px] border-neutral-300 bg-white/10 px-[120px] py-5 backdrop-blur-[100px]">
                <div className="flex w-[202px] flex-col gap-0.5">
                    <p className="text-[16px] text-primary-950">
                        Task {runStore.currentTaskIndex + 1} of {simulation.tasks.length}
                    </p>
                    <div className="h-2 w-full rounded-lg bg-[#d4d5d8]">
                        <div className="h-2 rounded bg-primary-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[28px] leading-[1.2] text-[#0a0c12]">{job.title}</p>
                    <p className="text-[16px] text-neutral-400">{job.employer.companyName}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[16px] text-neutral-400">
                        <CloudUpload className="size-6" />
                        {isSaving ? "Saving..." : "Autosaved"}
                    </div>
                    <div
                        className={`flex h-[52px] items-center gap-2 rounded px-3 py-2 ${timer.isWarning ? "bg-error-500" : "bg-primary-950"
                            }`}
                    >
                        <Timer className="size-6 text-neutral-50" />
                        <span className="text-[32px] leading-[38px] tracking-[-0.32px] text-neutral-50">{timer.formatted}</span>
                    </div>
                </div>
            </div>
            <main className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 pb-20 pt-[180px]">
                <div className="flex w-full max-w-[986px] flex-col gap-10 rounded-3xl bg-white p-10 shadow-[0px_4px_10px_rgba(16,24,40,0.05)]">
                    <div className="flex w-full items-center justify-between">
                        <p className="text-[16px] text-primary-500">Task • {task.category}</p>
                        <span className="rounded-full border border-secondary-500 bg-[#fef6e5] px-4 py-1 text-[16px] text-secondary-500">
                            Weight: —
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h1 className="text-[40px] leading-[48px] tracking-[-0.4px] text-primary-950">{task.title}</h1>
                        <p className="text-[16px] text-neutral-700">{task.scenarioDescription}</p>
                    </div>

                    <div className="flex w-full flex-col gap-6">
                        <div className="rounded-xl border-l-[3px] border-primary-500 bg-primary-50 p-4">
                            <p className="mb-2 text-[10px] text-primary-500">SCENARIO</p>
                            <p className="text-[16px] text-neutral-700">{task.scenarioDescription}</p>
                        </div>
                        <TaskObjectiveOptions
                            task={task}
                            selectedIndex={answer.selectedOptionIndex}
                            onSelect={(index) => updateAnswer({ selectedOptionIndex: index })}
                        />

                        <TaskResponseInput
                            task={task}
                            value={answer.textResponse}
                            onChange={(value) => updateAnswer({ textResponse: value })}
                        />
                    </div>

                    <div className="h-px w-full bg-neutral-200" />

                    <div className="flex w-full items-center justify-between opacity-70">
                        {/* Previous Task is permanently disabled — forward-only, per your call */}
                        <ActionButton variant="outline" size="md" disabled>
                            Previous Task
                        </ActionButton>
                        <ActionButton variant="primary" size="md" onClick={handleNext}>
                            {isLastTask ? "Submit Simulation" : "Next Task"}
                        </ActionButton>
                    </div>
                </div>
            </main>
        </div>
    );



}