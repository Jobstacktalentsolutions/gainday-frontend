export type UserStatus = "active" | "pending" | "flagged" | "suspended";

export interface EmployerProfile {
    companyName: string;
    isVerified: boolean;
    adminNotes?: string;
}

interface AdminAccountBase {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
}

export interface AdminEmployer extends AdminAccountBase {
    role: "Employer";
    employerProfile: EmployerProfile;
}

export interface AdminCandidate extends AdminAccountBase {
    role: "Candidate";
}

export type AdminAccount = AdminEmployer | AdminCandidate;
