import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Application } from "../types/application";

export const APPLICATIONS_QUERY_KEY = ["candidate", "applications"] as const;

// GET /submissions/mine — the signed-in candidate's submitted applications, newest first.
const fetchMyApplications = async (): Promise<Application[]> => {
    const { data } = await apiClient.get<Application[]>("/submissions/mine");
    return data;
};

export const useMyApplications = () => {
    return useQuery({
        queryKey: APPLICATIONS_QUERY_KEY,
        queryFn: fetchMyApplications,
    });
};
