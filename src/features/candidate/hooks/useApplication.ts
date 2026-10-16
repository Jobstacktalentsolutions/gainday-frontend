import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { ApplicationDetail } from "../types/application";
import { APPLICATIONS_QUERY_KEY } from "./useMyApplications";

// GET /submissions/mine/:id — one application plus the details of the job it was for.
const fetchApplication = async (id: string): Promise<ApplicationDetail> => {
    const { data } = await apiClient.get<ApplicationDetail>(`/submissions/mine/${id}`);
    return data;
};

export const useApplication = (id: string | undefined) => {
    return useQuery({
        queryKey: [...APPLICATIONS_QUERY_KEY, id],
        queryFn: () => fetchApplication(id!),
        enabled: !!id,
    });
};
