import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TrendingUp, ArrowRight, CheckCircle2, History, X } from "lucide-react";
import { PublicNavbar } from "../components/PublicNavbar";
import AppLoader from "@/components/ui/AppLoader";
import { ActionButton } from "@/components/ui/ActionButton";
import { useSubmissionResult } from "../hooks/useSubmission";

export default function SubmissionResultPage() {
    const { submissionId } = useParams<{ submissionId: string }>();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useSubmissionResult(submissionId);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    if (isLoading) {
        return <AppLoader />;
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-4 text-center text-neutral-700">
                <p className="text-xl font-semibold text-neutral-900">Submission Result Not Found</p>
                <p className="text-sm text-neutral-500 max-w-md">
                  We couldn't retrieve your submission details. Please verify the link or check your profile for completed applications.
                </p>
                <ActionButton variant="primary" onClick={() => navigate("/job-board")}>
                    Return to Job Board
                </ActionButton>
            </div>
        );
    }

    const {
        overallScore,
        completedDate,
        job,
        metrics,
        cumulativeCapabilityScore,
        cumulativeDelta,
        taskEvidence,
    } = data;

    return (
        <div className="min-h-screen w-full bg-neutral-50 pb-20">
            <PublicNavbar />

            <main className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-28 sm:pt-36">
                <div className="flex w-full flex-col gap-8 rounded-3xl bg-white p-6 shadow-xs border border-neutral-200/60 sm:p-12">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-1 text-center">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-primary-500">
                            SUBMISSION RESULT
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                            {job.title}
                        </h1>
                        <p className="text-sm text-neutral-500">
                            {job.companyName} &bull; Completed {completedDate}
                        </p>
                    </div>

                    {/* Main Score Display */}
                    <div className="flex flex-col items-center justify-center my-2 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-6xl font-bold tracking-tight text-neutral-950 sm:text-7xl">
                                {overallScore}
                            </span>
                            <span className="text-sm font-semibold text-primary-600 sm:text-base">
                                /100
                            </span>
                        </div>
                    </div>

                    {/* 5 Category Metric Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {metrics.map((metric, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-200/80 bg-white p-4 text-center transition-colors hover:border-primary-300"
                            >
                                <span className="text-2xl font-bold text-neutral-950">
                                    {metric.score}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                    {metric.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Cumulative Capability Score Banner */}
                    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200/60 bg-neutral-100/60 p-6 md:flex-row md:items-center">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
                                <TrendingUp className="size-4 text-neutral-600" />
                                <span>CUMULATIVE CAPABILITY SCORE</span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-4xl font-bold tracking-tight text-neutral-950">
                                    {cumulativeCapabilityScore}
                                </span>
                                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-200/50">
                                    <TrendingUp className="size-3.5" />
                                    {cumulativeDelta}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowHistoryModal(true)}
                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300/80 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-950"
                        >
                            <span>View Score History</span>
                            <ArrowRight className="size-4" />
                        </button>
                    </div>

                    {/* Task Feedback / Evidence Section */}
                    <div className="flex flex-col gap-4 pt-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-primary-500">
                                TASK FEEDBACK
                            </span>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
                                    Evidence behind your score
                                </h2>
                                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                                    {taskEvidence.length} {taskEvidence.length === 1 ? 'Task' : 'Tasks'}
                                </span>
                            </div>
                        </div>

                        {/* Task Feedback Cards List */}
                        <div className="flex flex-col gap-4 mt-2">
                            {taskEvidence.map((item, idx) => (
                                <div
                                    key={item.taskId || idx}
                                    className="flex flex-col gap-2 rounded-2xl border border-neutral-200/50 bg-neutral-100/60 p-6"
                                >
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
                                        TASK {item.taskNumber}
                                    </span>
                                    <h3 className="text-lg font-bold text-neutral-950">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-neutral-700">
                                        {item.summary}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            {/* Score History Modal */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-xl border border-neutral-200">
                        <button
                            type="button"
                            onClick={() => setShowHistoryModal(false)}
                            className="absolute right-5 top-5 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        >
                            <X className="size-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="rounded-xl bg-primary-50 p-2.5 text-primary-500">
                                <History className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-neutral-950">Score History</h3>
                                <p className="text-xs text-neutral-500">Your recent simulation evaluations</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between rounded-2xl border border-primary-200 bg-primary-50/50 p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="size-5 text-primary-600" />
                                    <div>
                                        <p className="text-sm font-bold text-neutral-950">{job.title}</p>
                                        <p className="text-xs text-neutral-500">{completedDate}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-bold text-primary-600">{overallScore}/100</p>
                                    <p className="text-[10px] font-bold text-emerald-600">{cumulativeDelta}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 p-4 opacity-75">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="size-5 text-neutral-400" />
                                    <div>
                                        <p className="text-sm font-bold text-neutral-900">Previous Simulation Assessment</p>
                                        <p className="text-xs text-neutral-500">12 September 2026</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-bold text-neutral-800">703/1000</p>
                                    <p className="text-[10px] font-medium text-neutral-500">Baseline score</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <ActionButton variant="outline" size="sm" onClick={() => setShowHistoryModal(false)}>
                                Close
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
