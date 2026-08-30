import type { AdminEmployer } from "../types/user";

export const mockEmployers: AdminEmployer[] = [
  {
    id: "usr_1",
    name: "Amaka Nwosu",
    email: "amaka@finpath.co",
    role: "Employer",
    status: "active",
    employerProfile: {
      companyName: "FinPath Capital",
      isVerified: true,
      adminNotes: "Verified via company domain email + LinkedIn.",
    },
  },
  {
    id: "usr_4",
    name: "Femi Solarin",
    email: "femi@quantumcap.ng",
    role: "Employer",
    status: "flagged",
    employerProfile: {
      companyName: "Quantum Capital",
      isVerified: false,
      adminNotes: "Flagged: multiple job posts reported for misleading pay ranges.",
    },
  },
];
