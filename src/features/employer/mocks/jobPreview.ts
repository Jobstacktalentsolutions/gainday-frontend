import type { JobPreviewDetails } from "../types/jobPreview";
import { MOCK_TASKS } from "./jobPostingDefaults";

const CORE_SKILLS = ["Business management", "PowerPoint", "Data analysis", "Stakeholder comm."];

export const MOCK_JOB_PREVIEWS: JobPreviewDetails[] = [
    {
        id: "job-draft-1",
        title: "Compliance Analyst, Associate",
        status: "DRAFT",
        location: "Lagos, Nigeria (hybrid)",
        employmentType: "Full-time",
        submissionsCount: 0,
        postedAt: null,
        shareUrl: "",
        description:
            "Support the Global Head of Custody Operations with business reviews, reporting and cross line of business initiatives.",
        category: "Finance",
        salary: "£9,000,000 to £13,500,000",
        deadline: "30 Aug 2026",
        isRemoteFriendly: true,
        requiredSkills: CORE_SKILLS,
        whatThisHireNeedsToSolve:
            "Client satisfaction has fallen three points and no one owns the weekly reporting or the follow up with regional leads.",
        tasks: MOCK_TASKS,
    },
    {
        id: "job-active-1",
        title: "Custody Operations Business Manager",
        status: "ACTIVE",
        location: "Lagos, Nigeria (hybrid)",
        employmentType: "Full-time",
        submissionsCount: 24,
        postedAt: "2026-08-12T00:00:00.000Z",
        shareUrl: "https://gainday.com/jobs/custody-operations-business-manager",
        description:
            "Support the Global Head of Custody Operations with business reviews, reporting and cross line of business initiatives.",
        category: "Finance",
        salary: "£9,000,000 to £13,500,000",
        deadline: "30 Aug 2026",
        isRemoteFriendly: true,
        requiredSkills: CORE_SKILLS,
        whatThisHireNeedsToSolve:
            "Client satisfaction has fallen three points and no one owns the weekly reporting or the follow up with regional leads.",
        tasks: MOCK_TASKS,
    },
    {
        // Figma calls this "Under review" — mapped to INACTIVE, see note above
        id: "job-under-review-1",
        title: "Credit Risk Analyst",
        status: "INACTIVE",
        location: "Lagos, Nigeria (hybrid)",
        employmentType: "Full-time",
        submissionsCount: 24,
        postedAt: "2026-08-12T00:00:00.000Z",
        shareUrl: "https://gainday.com/jobs/credit-risk-analyst",
        description:
            "Own the credit risk scoring review for retail lending products and flag exposure changes to the risk committee.",
        category: "Finance",
        salary: "£7,500,000 to £11,000,000",
        deadline: "30 Aug 2026",
        isRemoteFriendly: true,
        requiredSkills: CORE_SKILLS,
        whatThisHireNeedsToSolve:
            "Loan default flags have doubled quarter over quarter and nobody is triaging the model's risk alerts daily.",
        tasks: MOCK_TASKS,
    },
    {
        id: "job-shortlist-1",
        title: "Treasury Operations Associate",
        status: "SHORTLIST_READY",
        location: "Lagos, Nigeria (hybrid)",
        employmentType: "Full-time",
        submissionsCount: 37,
        postedAt: "2026-08-02T00:00:00.000Z",
        shareUrl: "https://gainday.com/jobs/treasury-operations-associate",
        description:
            "Manage daily cash positioning and support treasury reporting for the group's regional banking relationships.",
        category: "Finance",
        salary: "£6,000,000 to £9,500,000",
        deadline: "20 Aug 2026",
        isRemoteFriendly: false,
        requiredSkills: CORE_SKILLS,
        whatThisHireNeedsToSolve:
            "Cash sweep reconciliations are two days behind and treasury can't confirm same-day liquidity to the board.",
        tasks: MOCK_TASKS,
    },
    {
        id: "job-closed-1",
        title: "Financial Reporting Analyst",
        status: "TERMINATED",
        location: "Lagos, Nigeria (hybrid)",
        employmentType: "Full-time",
        submissionsCount: 22,
        postedAt: "2026-07-14T00:00:00.000Z",
        shareUrl: "https://gainday.com/jobs/financial-reporting-analyst",
        description:
            "Prepare monthly and quarterly financial statements and support the year-end audit process.",
        category: "Finance",
        salary: "£5,500,000 to £8,000,000",
        deadline: "1 Aug 2026",
        isRemoteFriendly: true,
        requiredSkills: CORE_SKILLS,
        whatThisHireNeedsToSolve:
            "Month-end close has slipped past the 5-business-day target for three consecutive months.",
        tasks: MOCK_TASKS,
        hiredCandidateId: "B1820",
    },
];