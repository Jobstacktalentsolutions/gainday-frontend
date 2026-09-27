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

    useTabVisibilityGuard({
    onViolation: (reason) => addFlag(`task-${runStore.currentTaskIndex}-${reason}`),
  }).arm(); // re-armed here — the guard from EnvironmentCheckPage is a separate hook instance
}