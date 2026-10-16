import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

// GET /jobs/:id returns the whole job row; the submissions page only needs the title. `title` is
// nullable in the jobs table (drafts), but a job with submissions has been published.
const fetchJobTitle = async (jobId: string): Promise<string | null> => {
    const { data } = await apiClient.get<{ title: string | null }>(`/jobs/${jobId}`);
    return data.title;
};

export const useJobTitle = (jobId: string | undefined) => {
    return useQuery({
        queryKey: ["employer", "job-title", jobId],
        queryFn: () => fetchJobTitle(jobId as string),
        enabled: Boolean(jobId),
    });
};
