import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockAdminJobs } from "../mocks/adminJobsData";
import type { AdminJob } from "../types/job";

const SIMULATED_LATENCY_MS = 400 ;

//replace this withe real API call later
async function fetchEmployerJobs() : Promise<AdminJob[]> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return mockAdminJobs ;
}

//also replace withe API call