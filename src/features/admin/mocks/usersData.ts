import type { AdminUser } from "../types/user";

export const mockUsers: AdminUser[] = [
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
    id: "usr_2",
    name: "Tunde Bakare",
    email: "tunde.b@gmail.com",
    role: "Candidate",
    status: "active",
  },
  {
    id: "usr_3",
    name: "Chidera Okafor",
    email: "chidera.o@outlook.com",
    role: "Candidate",
    status: "pending",
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