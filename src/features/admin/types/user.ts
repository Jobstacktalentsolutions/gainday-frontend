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
