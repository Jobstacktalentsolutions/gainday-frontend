import type { ApplicationStatus } from "../types/application";

interface ApplicationStatusMeta {
    label: string;
    badgeClass: string;
    /** In-progress applications can be withdrawn; finished ones can't. */
    canWithdraw: boolean;
}

export const APPLICATION_STATUS_META: Record<ApplicationStatus, ApplicationStatusMeta> = {
    PENDING_REVIEW: { label: "Pending Review", badgeClass: "bg-warning-50 text-warning-500", canWithdraw: true },
    REVIEWED: { label: "Reviewed", badgeClass: "bg-primary-50 text-primary-500", canWithdraw: true },
    INTERVIEW_SCHEDULED: { label: "Interview Scheduled", badgeClass: "bg-primary-50 text-primary-500", canWithdraw: true },
    OFFER_EXTENDED: { label: "Offer Extended", badgeClass: "bg-success-50 text-success-500", canWithdraw: true },
    NOT_SELECTED: { label: "Not Selected", badgeClass: "bg-neutral-50 text-neutral-950", canWithdraw: false },
    HIRED: { label: "Hired", badgeClass: "bg-success-50 text-success-500", canWithdraw: false },
    WITHDRAWN: { label: "Withdrawn", badgeClass: "bg-primary-50 text-neutral-950", canWithdraw: false },
};