import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ReviewPublish from "./ReviewPublish";
import type { JobPostingFormValues } from "../schemas/jobPosting";

const { publish } = vi.hoisted(() => ({ publish: vi.fn() }));
vi.mock("../hooks/usePublishJob", () => ({ usePublishJob: () => ({ mutateAsync: publish }) }));
vi.mock("../hooks/useSaveJobDraft", () => ({ useSaveJobDetails: () => ({ mutateAsync: vi.fn(), isPending: false }) }));
vi.mock("../hooks/useJobSimulation", () => ({ useJobSimulation: () => ({ data: { simulation: { tasks: [], timeLimitMinutes: 30 } } }) }));
vi.mock("../hooks/useTaskReviewStatus", () => ({ useTaskReviewStatus: () => ({ data: { pendingCount: 0 } }) }));
vi.mock("../components/JobDetailsSummary", () => ({ default: () => <div>Saved job details</div> }));
vi.mock("../components/PublishSuccess", () => ({ default: () => <div>Published</div> }));

function Harness() {
    const form = useForm<JobPostingFormValues>({ defaultValues: { title: "Saved role", tasks: [] } });
    return <FormProvider {...form}><Outlet context={{ jobId: "post-123" }} /></FormProvider>;
}

describe("review publish", () => {
    it("publishes the saved post without revalidating incomplete local form state", async () => {
        publish.mockResolvedValue({ id: "post-123" });
        render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={["/review?postId=post-123"]}><Routes>
            <Route element={<Harness />}><Route path="/review" element={<ReviewPublish />} /></Route>
        </Routes></MemoryRouter></QueryClientProvider>);
        fireEvent.click(screen.getByRole("checkbox"));
        fireEvent.click(screen.getByRole("button", { name: "Publish job" }));
        await waitFor(() => expect(publish).toHaveBeenCalledWith("post-123"));
        expect(await screen.findByText("Published")).toBeInTheDocument();
    });
});
