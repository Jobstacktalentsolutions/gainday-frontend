export type UserRole = "Employer" | "Candidate";
export type UserStatus = "active" | "pending" | "flagged";


export interface EmployerProfile {
    companyName: string;
    isVerified: boolean;
    adminNotes?: string;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    employerProfile?: EmployerProfile;
}

