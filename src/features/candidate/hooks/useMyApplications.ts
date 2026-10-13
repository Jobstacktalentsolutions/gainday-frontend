import { useQuery } from "@tanstack/react-query";
import { MOCK_APPLICATIONS } from "../mocks/applications";
import type { Application } from "../types/application";

const MOCK_LATENCY_MS = 600;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: swap for the real endpoint. useAppliedJobIds already hits the real submissions list, but
// that doesn't carry job/company details, a reference or a hiring status.
const fetchMyApplications = async (): Promise<Application[]> => {
    await wait(MOCK_LATENCY_MS);
    return MOCK_APPLICATIONS;
};

export const useMyApplications = () => {
    return useQuery({
        queryKey: ["candidate", "applications"],
        queryFn: fetchMyApplications,
    });
};