import type { ApplicationStatus } from "../types/application";

interface ApplicationStatusMeta {
    label: string;
    badgeClass: string;
    /** Withdrawing is only possible until the employer has decided; after that it's final. */
    canWithdraw: boolean;
}

export const APPLICATION_STATUS_META: Record<ApplicationStatus, ApplicationStatusMeta> = {
    PENDING: { label: "Pending", badgeClass: "bg-warning-50 text-warning-500", canWithdraw: true },
    GRADING: { label: "Grading", badgeClass: "bg-warning-50 text-warning-500", canWithdraw: true },
    GRADED: { label: "Graded", badgeClass: "bg-primary-50 text-primary-500", canWithdraw: true },
    GRADING_FAILED: { label: "Grading failed", badgeClass: "bg-error-50 text-error-600", canWithdraw: true },
    SELECTED: { label: "Selected", badgeClass: "bg-success-50 text-success-500", canWithdraw: false },
    NOT_SELECTED: { label: "Not Selected", badgeClass: "bg-neutral-50 text-neutral-950", canWithdraw: false },
    DISQUALIFIED: { label: "Disqualified", badgeClass: "bg-error-50 text-error-600", canWithdraw: false },
    WITHDRAWN: { label: "Withdrawn", badgeClass: "bg-primary-50 text-neutral-950", canWithdraw: false },
};
