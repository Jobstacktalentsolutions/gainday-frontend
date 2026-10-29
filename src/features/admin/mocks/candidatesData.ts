import type { AdminCandidate } from "../types/user";

export const mockCandidates: AdminCandidate[] = [
  {
    id: "usr_2",
    name: "Alex Morgan",
    email: "alex.m@gmail.com",
    role: "CANDIDATE",
    status: "active",
  },
  {
    id: "usr_3",
    name: "Jordan Lee",
    email: "jordan.l@outlook.com",
    role: "CANDIDATE",
    status: "pending",
  },
];
