import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockAdminJobs } from "../mocks/adminJobsData";
import type { AdminJob } from "../types/job";

const SIMULATED_LATENCY_MS = 400 ;

//replace this withe real API call later
async function fetchAdminJobs() : Promise<AdminJob[]> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return mockAdminJobs ;
}

//also replace withe API call
async function removeJobPost(jobid : string) : Promise<AdminJob> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const job = mockAdminJobs.find((j) => j.id === jobid) ;
    if (!job) throw new Error("Job not found");
    return { ...job, status : "closed"};
}

export function useAdminJobs() {
    return useQuery({
        queryKey : ["admin", "jobs"],
        queryFn: fetchAdminJobs,
    })
}

export function useRemoveJobPost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : removeJobPost,
        onSuccess : (updatedJob) => {
            queryClient.setQueryData<AdminJob[]>(["admin", "jobs"], (prev) => 
            prev?.map((j) => (j.id === updatedJob.id ? updatedJob : j)))
        }
    })
}