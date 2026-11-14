import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useOutletContext } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import JobPostingWizardLayout from "./JobPostingWizardLayout";
import { useJobDraftStore } from "../stores/useJobDraftStore";
import type { JobPostingFormInput } from "../schemas/jobPosting";

const { getJob } = vi.hoisted(() => ({ getJob: vi.fn() }));
vi.mock("../hooks/useJobSimulation", () => ({ useJobSimulation: getJob }));
vi.mock("../hooks/useSaveJobDraft", () => ({ useSaveJobDraft: () => ({ mutateAsync: vi.fn() }) }));

function Step() {
    const { jobId } = useOutletContext<{ jobId: string | null }>();
    const { getValues } = useFormContext<JobPostingFormInput>();
    return <div>{jobId}: {getValues("title")}</div>;
}

function renderWizard(url: string) {
    return render(<MemoryRouter initialEntries={[url]}><Routes>
        <Route path="/employer/jobs/new" element={<JobPostingWizardLayout />}>
            <Route path="review" element={<Step />} />
            <Route path="details" element={<Step />} />
        </Route>
        <Route path="/employer/jobs" element={<div>Jobs list</div>} />
    </Routes></MemoryRouter>);
}

describe("saved wizard navigation", () => {
    beforeEach(() => {
        useJobDraftStore.getState().clearDraft();
        getJob.mockReset();
    });

    it("loads the saved job identified by the URL instead of local draft fields", () => {
        useJobDraftStore.getState().setDraft({ title: "Old local draft" });
        getJob.mockImplementation((id: string | null) => ({ data: id ? {
            title: "Saved role", role: "Sales", skillLevel: "Junior", skillCategory: null,
            location: "London", employmentType: "Full-time", applicationDeadline: null,
            isRemoteFriendly: false, salaryRange: null, companyDescription: null,
            requiredSkills: [], description: "Saved description", businessProblem: null, simulation: null,
        } : null, isError: false }));
        renderWizard("/employer/jobs/new/review?postId=saved-123");
        expect(getJob).toHaveBeenCalledWith("saved-123");
        expect(screen.getByText("saved-123: Saved role")).toBeInTheDocument();
    });

    it("does not open a saved step without a URL id", () => {
        getJob.mockReturnValue({ data: null, isError: false });
        renderWizard("/employer/jobs/new/review");
        expect(screen.getByText("Jobs list")).toBeInTheDocument();
    });
});
