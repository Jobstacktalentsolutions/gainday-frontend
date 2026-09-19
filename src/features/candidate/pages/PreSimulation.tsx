import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Maximize, MonitorCheck, Clock, ChevronLeft } from "lucide-react";
import { PublicNavbar } from "../components/PublicNavbar";
import { ActionButton } from "@/components/ui/action-button";
import { Checkbox } from "@/components/ui/checkbox";
import { useJobDetails } from "../hooks/useJobDetails";
import { getMockSimulation } from "../data/mock-simulations";
import { formatPostedDate } from "../utils/formatters";

const CHECKS = [
  {
    icon: Maximize,
    title: "Full-screen mode",
    description: "Your browser switches to full-screen for the length of the simulation.",
  },
  {
    icon: MonitorCheck,
    title: "Tab-switch detection",
    description: "Switching to another tab or window during the simulation is tracked.",
  },
  {
    icon: Clock,
    title: "Idle-time tracking",
    description: "Extended periods of inactivity are flagged for review.",
  },
];

export function PreSimulationPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { job } = useJobDetails(jobId);
  const [consented, setConsented] = useState(false);

  if (!job) {
    // TODO: proper "job not found" state, same open item as JobDetailsPage
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-700">
        Job not found.
      </div>
    );
  }

  const simulation = getMockSimulation(job);

  function handleBegin() {
    // TODO: simulation runner isn't built yet — stub only
    console.log("TODO: begin simulation", job.id);
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      <PublicNavbar />

      <main className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-20 px-5 pb-20 pt-[135px] sm:pt-[175px]">
        <button
          type="button"
          onClick={() => navigate(`/job-board/${job.id}`)}
          className="flex w-full items-center gap-5 text-[16px] text-primary-950"
        >
          <ChevronLeft className="size-6" />
          Go back to job description
        </button>

        <div className="relative w-full max-w-[986px] overflow-hidden rounded-3xl bg-white p-10 shadow-[0px_4px_10px_rgba(16,24,40,0.05)]">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col items-center gap-1">
              <p className="text-[16px] text-primary-500">Applying to</p>
              <h1 className="text-[40px] leading-[48px] tracking-[-0.4px] text-[#0a0c12]">
                {job.title} at {job.employer.companyName}
              </h1>
              <p className="text-[16px] text-neutral-400">Before you begin...</p>
            </div>

            <div className="flex w-full flex-col gap-6 rounded-xl bg-neutral-50 p-6 text-left">
              {CHECKS.map((check, index) => (
                <div key={check.title} className="flex flex-col gap-6">
                  <div className="flex items-center gap-5">
                    <check.icon className="size-5 shrink-0 text-primary-500" />
                    <div className="flex flex-1 flex-col text-[16px]">
                      <p className="text-[#0a0c12]">{check.title}</p>
                      <p className="text-neutral-400">{check.description}</p>
                    </div>
                  </div>
                  {index < CHECKS.length - 1 && <div className="h-px w-full bg-neutral-200" />}
                </div>
              ))}
            </div>

            <p className="text-[16px] text-neutral-400">
              These checks exist so employers can trust every ranked result. Your camera and microphone are never
              recorded.
            </p>

            <div className="flex w-full gap-3">
              <div className="flex flex-1 flex-col gap-3 rounded-lg border border-neutral-200 p-4 shadow-[0px_4px_20px_rgba(16,24,40,0.05)]">
                <p className="text-[32px] leading-[38px] tracking-[-0.32px] text-black">{simulation.tasks.length}</p>
                <p className="text-[16px] text-neutral-700">Tasks</p>
              </div>
              <div className="flex flex-1 flex-col gap-3 rounded-lg border border-neutral-200 p-4 shadow-[0px_4px_20px_rgba(16,24,40,0.05)]">
                <p className="text-[32px] leading-[38px] tracking-[-0.32px] text-black">
                  ~{simulation.timeLimitMinutes} min
                </p>
                <p className="text-[16px] text-neutral-700">Est. time allowed</p>
              </div>
              <div className="flex flex-1 flex-col gap-3 rounded-lg border border-neutral-200 p-4 shadow-[0px_4px_20px_rgba(16,24,40,0.05)]">
                <p className="text-[32px] leading-[38px] tracking-[-0.32px] text-black">
                  {formatPostedDate(job.applicationDeadline)}
                </p>
                <p className="text-[16px] text-neutral-700">Deadline</p>
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e6e6e8] bg-neutral-50 p-3">
              <Checkbox
                id="monitoring-consent"
                checked={consented}
                onCheckedChange={(checked) => setConsented(checked === true)}
              />
              <label htmlFor="monitoring-consent" className="text-xs text-[#0a0c12]">
                I understand this session is monitored, as described above.
              </label>
            </div>

            <ActionButton variant="primary" size="lg" disabled={!consented} onClick={handleBegin}>
              Begin Simulation
            </ActionButton>
          </div>
        </div>
      </main>
    </div>
  );
}