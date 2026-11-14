import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { MemoryRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SimulationBuilder from "./SimulationBuilder";
import type { JobPostingFormValues } from "../schemas/jobPosting";

vi.mock("../hooks/useJobSimulation", () => ({ useJobSimulation: () => ({ data: { status: "DRAFT", simulation: { id: "sim", tasks: [], timeLimitMinutes: 30 } }, isLoading: false }) }));
vi.mock("../hooks/useGenerationProgress", () => ({ useGenerationProgress: () => ({ status: "idle", restart: vi.fn() }) }));
vi.mock("../hooks/useTriggerGeneration", () => ({ useTriggerGeneration: () => ({ mutateAsync: vi.fn() }) }));
vi.mock("../hooks/useRegenerateTask", () => ({ useRegenerateTask: () => ({ regenerate: vi.fn() }) }));
vi.mock("../hooks/useRegenerateAllTasks", () => ({ useRegenerateAllTasks: () => ({ regenerateAll: vi.fn() }) }));
vi.mock("../hooks/useUpdateSimulationTasks", () => ({ useUpdateSimulationTasks: () => ({ mutateAsync: vi.fn() }) }));
vi.mock("../components/TaskGenerationModal", () => ({ default: () => null }));
vi.mock("../components/RegenerationFailureModal", () => ({ default: () => null }));
vi.mock("../components/RegenerateGuidanceModal", () => ({ default: () => null }));

function Harness() {
    const form = useForm<JobPostingFormValues>({ defaultValues: { tasks: [] } });
    return <FormProvider {...form}><Outlet context={{ jobId: "post-123" }} /></FormProvider>;
}
function Destination() {
    const location = useLocation();
    return <div>Details page {location.search}</div>;
}

describe("simulation builder back navigation", () => {
    it("asks before leaving and keeps the saved post id", () => {
        render(<MemoryRouter initialEntries={["/simulation-builder?postId=post-123"]}><Routes>
            <Route element={<Harness />}><Route path="/simulation-builder" element={<SimulationBuilder />} /></Route>
            <Route path="/employer/jobs/new/details" element={<Destination />} />
        </Routes></MemoryRouter>);
        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        expect(screen.getByRole("alertdialog")).toHaveTextContent("Unsaved task changes will be lost");
        fireEvent.click(screen.getByRole("button", { name: "Stay here" }));
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        fireEvent.click(screen.getByRole("button", { name: "Go back" }));
        expect(screen.getByText("Details page ?postId=post-123")).toBeInTheDocument();
    });
});
