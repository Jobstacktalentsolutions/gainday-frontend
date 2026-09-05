import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { StepSecondaryButton, StepContinueButton } from "@/components/ui/StepNavigationButtons";
import JobDetailsSummary from "../components/review/JobDetailsSummary";
import JobDetailsEditForm from "../components/review/JobDetailsEditForm";
import TaskSummaryCard from "../components/review/TaskSummaryCard";
import PublishSuccess from "../components/review/PublishSuccess";
import type { JobPostingFormValues } from "../schemas/jobPosting";

const EASE = [0.16, 1, 0.3, 1] as const;

const ReviewPublishStep = () => {
  const navigate = useNavigate();
  const { watch, trigger } = useFormContext<JobPostingFormValues>();
  const values = watch();

  const [editingJobDetails, setEditingJobDetails] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ jobUrl: string } | null>(null);

  const handleEditSimulation = () => {
    // Per the design: editing the task list navigates back to the actual step,
    // rather than editing inline like Job Details does.
    navigate("/employer/jobs/new/simulation");
  };

  const handlePublish = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsPublishing(true);
    // TODO: replace with the real publish API call.
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const slug = values.title.toLowerCase().replace(/\s+/g, "-");
    setPublishResult({ jobUrl: `gainday.com/jobs/${slug}` });
    setIsPublishing(false);
  };

  if (publishResult) {
    return (
      <div className="flex flex-col gap-12">
        <PublishSuccess
          jobTitle={values.title}
          jobUrl={publishResult.jobUrl}
          onViewJob={() => navigate("/employer/jobs")}
          onViewCandidates={() => navigate("/employer/jobs")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col lg:items-center gap-2 text-left lg:text-center">
        <h1 className="text-3xl font-bold text-black lg:text-4xl">Review and Publish</h1>
        <p className="max-w-lg text-base text-neutral-500">
          Check everything below before this goes live on the Gainday board.
        </p>
      </div>

      <div className="flex w-full flex-col gap-6 rounded-3xl border border-dashed shadow-sm bg-white/70 px-3 py-10">
        {/* Job details section */}
        <motion.div layout transition={{ duration: 0.3, ease: EASE }}>
          <AnimatePresence mode="wait" initial={false}>
            {editingJobDetails ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <JobDetailsEditForm onDone={() => setEditingJobDetails(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <JobDetailsSummary onEdit={() => setEditingJobDetails(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="h-px bg-neutral-200" />

        {/* Simulation tasks section */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">
              Simulation tasks
            </p>
            <button
              type="button"
              onClick={handleEditSimulation}
              className="flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Edit
            </button>
          </div>

          {values.tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06, ease: EASE }}
            >
              <TaskSummaryCard index={index} task={task} />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 p-5">
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold text-neutral-950">{values.tasks.length}</p>
            <p className="text-sm text-neutral-500">Tasks</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold text-neutral-950">{values.estimatedCompletionTime}</p>
            <p className="text-sm text-neutral-500">Estimated completion time</p>
          </div>
        </div>

        {/* Agreement */}
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-5 rounded"
          />
          <span className="text-base text-neutral-700">
            I have reviewed the job details and the work simulation. This is ready to go live.
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <StepSecondaryButton onClick={() => navigate(-1)}>Back</StepSecondaryButton>
        <StepContinueButton disabled={!agreed || isPublishing} onClick={handlePublish}>
          {isPublishing ? "Publishing..." : "Publish job"}
        </StepContinueButton>
      </div>
    </div>
  );
};

export default ReviewPublishStep;