import { Outlet } from "react-router-dom";
import { useSimulationDeviceCheck } from "../hooks/useSimulationDeviceCheck";
import DesktopOnlyNotice from "./DesktopOnlyNotice";

interface SimulationDeviceGuardProps {
    // For the live simulation route: only block touch devices, not a narrow desktop window.
    allowNarrowDesktop?: boolean;
}

const SimulationDeviceGuard = ({ allowNarrowDesktop = false }: SimulationDeviceGuardProps) => {
    const { canStartSimulation, canContinueSimulation } = useSimulationDeviceCheck();
    const allowed = allowNarrowDesktop ? canContinueSimulation : canStartSimulation;

    return allowed ? <Outlet /> : <DesktopOnlyNotice />;
};

export default SimulationDeviceGuard;