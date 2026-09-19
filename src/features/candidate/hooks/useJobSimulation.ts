import { useQuery } from "@tanstack/react-query";
import { getMockSimulation, type JobSimulation } from "../mocks/mockSimulations";
import type { JobBoardListing } from "../types/jobBoard";



// TODO: replace with a real GET /jobs/:id/simulation call once it exists, e.g.:
//   const { data } = await apiClient.get<JobSimulation>(`/jobs/${jobId}/simulation`);
//   return data;
// No GENERATING/polling state here (unlike the employer's useJobSimulation) —
// by the time a candidate reaches this page the job is ACTIVE, so its
// simulation is already persisted and final.
async function fetchMockJobSimulation(job : JobBoardListing) : Promise<JobSimulation> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getMockSimulation(job);

}


export function useJobSimulation( job : JobBoardListing | undefined) {
    return useQuery({
        queryKey : ["candidate", "job-simulation", job?.id],
        queryFn: () => fetchMockJobSimulation(job as JobBoardListing),
        enabled : Boolean(job),
    })
}