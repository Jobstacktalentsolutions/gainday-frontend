import type { AdminJob } from "../types/job";

export const mockAdminJobs: AdminJob[] = [
  {
    id: "job_1",
    title: "Custody Operations Business Manager",
    company: "JPMorgan",
    applicantCount: 34,
    status: "live",
  },
  {
    id: "job_2",
    title: "Finance Associate",
    company: "Stanbic IBTC",
    applicantCount: 12,
    status: "live",
  },
  {
    id: "job_3",
    title: "Sales Analyst",
    company: "Interswitch",
    applicantCount: 0,
    status: "closed",
  },
];