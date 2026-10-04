export type UserStatus = "active" | "pending" | "flagged" | "suspended";

export interface EmployerProfile {
    companyName: string;
    isVerified: boolean;
    adminNotes?: string;
    phoneNumber?: string;
    jobsCount?: number;
}

export interface CandidateProfile {
    phoneNumber?: string;
    submissionsCount?: number;
    location?: string;
    resumeUrl?: string;
}

export interface AdminAccountBase {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
    isActive?: boolean;
    suspensionReason?: string | null;
    suspendedAt?: string | null;
    createdAt?: string;
}

export interface AdminEmployer extends AdminAccountBase {
    role?: "EMPLOYER";
    employerProfile: EmployerProfile;
}

export interface AdminCandidate extends AdminAccountBase {
    role?: "JOB_SEEKER" | "CANDIDATE";
    candidateProfile?: CandidateProfile;
}

export interface AdminProfile {
    fullName: string;
    adminRole: "SUPER_ADMIN" | "MANAGER" | "MODERATOR";
    isSuperAdmin?: boolean;
}

export interface AdminUserAccount extends AdminAccountBase {
    role: "ADMIN";
    isActive: boolean;
    createdAt: string;
    adminProfile?: AdminProfile;
}

export type AdminAccount = AdminEmployer | AdminCandidate | AdminUserAccount;
