import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddItemButton from "@/components/ui/AddItemButton";

// Shown when there are zero ACTIVE jobs at all (not to be confused with
// NoResultsState, which covers zero results for the current filters).
export function EmptyJobBoardState() {
  const navigate = useNavigate();
  return (
    <div className="flex h-[414px] w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-primary-300 bg-white py-[29px]">
      <span className="flex size-[60px] items-center justify-center rounded-lg bg-primary-50">
        <Briefcase className="size-6 text-primary-500" />
      </span>
      <div className="flex flex-col items-center gap-6">
        <p className="w-[344px] text-center text-[16px] text-neutral-700">
          No live roles yet. New assessments are posted by employers every week.
        </p>
        <AddItemButton onClick={() => navigate("/employer/signup")}>
          Hiring? Post a Job
        </AddItemButton>
      </div>
    </div>
  );
}