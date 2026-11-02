import { Check } from "lucide-react";
import { motion } from "motion/react";
import { ShareJobPanel } from "./ShareJobPanel";

interface PublishSuccessProps {
  jobTitle: string;
  jobUrl: string;
  onViewJob: () => void;
  onCandidatePreview: () => void;
}

const PublishSuccess = ({ jobTitle, jobUrl, onViewJob, onCandidatePreview }: PublishSuccessProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full flex-col items-center gap-8 rounded-3xl border border-neutral-200 bg-white px-8 py-16 text-center"
    >
      {/* Pulsing check mark container */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{
          scale: [1, 1.06, 1],
          opacity: 1,
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          opacity: { duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
        }}
        className="relative flex size-24 items-center justify-center rounded-full bg-success-50"
      >
        <motion.div
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-success-200"
          aria-hidden="true"
        />
        <Check className="relative z-10 size-12 text-success-500" aria-hidden="true" />
      </motion.div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-neutral-950">Your job is live</h2>
        <p className="max-w-md text-base text-neutral-500">
          {jobTitle} is now live on the Gainday board.
        </p>
      </div>
      {/* 
      <div className="h-px w-full max-w-md bg-neutral-200" /> */}

      <ShareJobPanel jobTitle={jobTitle} jobUrl={jobUrl} />

      <div className="flex w-full max-w-md gap-3">
        <button
          type="button"
          onClick={onViewJob}
          className="flex h-13 flex-1 items-center justify-center cursor-pointer rounded-xl border border-neutral-200 text-base font-medium text-neutral-700 transition-all hover:bg-neutral-50"
        >
          View job
        </button>
        <button
          type="button"
          onClick={onCandidatePreview}
          className="flex h-13 flex-1 items-center justify-center cursor-pointer rounded-xl bg-primary-500 hover:bg-primary-600 text-base font-medium text-white shadow-sm transition-all hover:shadow-md"
        >
          Candidate preview
        </button>
      </div>
    </motion.div>
  );
};

export default PublishSuccess;
