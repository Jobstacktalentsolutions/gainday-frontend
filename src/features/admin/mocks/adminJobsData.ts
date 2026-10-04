import type { AdminJob } from "../types/job";

export const mockAdminJobs: AdminJob[] = [
  {
    id: "job_1",
    title: "Custody Operations Business Manager",
    company: "JPMorgan",
    applicantCount: 34,
    status: "live",
    createdAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: "job_2",
    title: "Finance Associate",
    company: "Stanbic IBTC",
    applicantCount: 12,
    status: "live",
    createdAt: "2026-10-02T10:00:00.000Z",
  },
  {
    id: "job_3",
    title: "Sales Analyst",
    company: "Interswitch",
    applicantCount: 0,
    status: "closed",
    createdAt: "2026-10-03T10:00:00.000Z",
  },
];