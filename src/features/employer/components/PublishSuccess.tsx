import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion } from "motion/react";

interface PublishSuccessProps {
  jobTitle: string;
  jobUrl: string;
  onViewJob: () => void;
  onViewCandidates: () => void;
}

const PublishSuccess = ({ jobTitle, jobUrl, onViewJob, onViewCandidates }: PublishSuccessProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jobUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full flex-col items-center gap-8 rounded-3xl border border-neutral-200 bg-white px-8 py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex size-24 items-center justify-center rounded-full bg-success-50"
      >
        <Check className="size-12 text-success-500" aria-hidden="true" />
      </motion.div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-neutral-950">Your job is live</h2>
        <p className="max-w-md text-base text-neutral-500">
          {jobTitle} is now live on the Gainday board.
        </p>
      </div>

      <div className="flex w-full max-w-md items-center justify-between rounded-xl border border-neutral-200 px-4 py-3">
        <span className="truncate text-sm text-neutral-700">{jobUrl}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="ml-3 flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-neutral-200 px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          <Copy className="size-3.5" aria-hidden="true" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex w-full max-w-md gap-3">
        <button
          type="button"
          onClick={onViewJob}
          className="flex h-13 flex-1 items-center justify-center rounded-xl border border-neutral-200 text-base font-medium text-neutral-700 transition-all hover:bg-neutral-50"
        >
          View job
        </button>
        <button
          type="button"
          onClick={onViewCandidates}
          className="flex h-13 flex-1 items-center justify-center rounded-xl bg-linear-to-r from-primary-500 to-primary-700 text-base font-medium text-white shadow-sm transition-all hover:shadow-md"
        >
          View candidates
        </button>
      </div>
    </motion.div>
  );
};

export default PublishSuccess;