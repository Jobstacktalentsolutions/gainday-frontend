import type { AdminEmployer } from "../types/user";

export const mockEmployers: AdminEmployer[] = [
  {
    id: "usr_1",
    name: "Sarah Jenkins",
    email: "sarah@finpath.co",
    role: "EMPLOYER",
    status: "active",
    employerProfile: {
      companyName: "FinPath Capital",
      isVerified: true,
      adminNotes: "Verified via company domain email + LinkedIn.",
    },
  },
  {
    id: "usr_4",
    name: "Marcus Vance",
    email: "marcus@quantumcap.com",
    role: "EMPLOYER",
    status: "flagged",
    employerProfile: {
      companyName: "Quantum Capital",
      isVerified: false,
      adminNotes: "Flagged: multiple job posts reported for misleading pay ranges.",
    },
  },
];
