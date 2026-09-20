import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

// GET /submissions/job/:jobId returns the full submission records (no lightweight count
// endpoint exists yet). We only need the count here, so we discard the bodies — see
// SubmissionsService.findByJob on the backend.
export const fetchJobSubmissionsCount = async (jobId: string): Promise<number> => {
    try {
        const { data } = await apiClient.get<unknown[]>(`/submissions/job/${jobId}`);
        return data.length;
    } catch {
        // A single job's submissions failing to load (e.g. a stale/foreign job id) shouldn't
        // sink the whole jobs list or preview page — fall back to 0 rather than surfacing an
        // error for a number that's supplementary, not primary, content.
        return 0;
    }
};

export const useJobSubmissionsCount = (jobId: string | undefined) => {
    return useQuery({
        queryKey: ["employer", "job-submissions-count", jobId],
        queryFn: () => fetchJobSubmissionsCount(jobId as string),
        enabled: Boolean(jobId),
    });
};
