import { useQuery } from "@tanstack/react-query";
import type { Job } from "../types/job";

const MOCK_JOBS: Job[] = [
  { id: "1", title: "Compliance Analyst, Associate", status: "DRAFT", location: "London, UK", employmentType: "Full-time", submissionsCount: 0, postedAt: null, shareUrl: "" },
  { id: "2", title: "Credit Risk Analyst", status: "GENERATING", location: "London, UK", employmentType: "Full-time", submissionsCount: 0, postedAt: "2026-08-06", shareUrl: "" },
  { id: "3", title: "Custody Operations Business Manager", status: "ACTIVE", location: "London, UK", employmentType: "Full-time", submissionsCount: 23, postedAt: "2026-08-12", shareUrl: "" },
  { id: "4", title: "Treasury Operations Associate", status: "SHORTLIST_READY", location: "London, UK", employmentType: "Full-time", submissionsCount: 37, postedAt: "2026-08-02", shareUrl: "" },
  { id: "5", title: "Financial Reporting Analyst", status: "INACTIVE", location: "London, UK", employmentType: "Full-time", submissionsCount: 22, postedAt: "2026-07-14", shareUrl: "" },
]

const fetchEmployerJobs = async () : Promise<Job[]> => {
    await new Promise((r) => setTimeout(r, 800));
    return MOCK_JOBS; //temporary fix
}

export const useEmployerJobs = () => {
    return useQuery({ queryKey : ["employer", "jobs"], queryFn : fetchEmployerJobs });
}