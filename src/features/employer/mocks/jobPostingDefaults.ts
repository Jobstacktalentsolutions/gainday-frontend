import { InterfaceType } from "@/features/simulation-tasks/types";
import type { JobPostingFormValues } from "../schemas/jobPosting";

// Sample tasks in the REAL SimulationTask shape — used only by JobPreview's own mock job-preview
// data (features/employer/mocks/jobPreview.ts), not by the live wizard anymore (SimulationBuilder
// now fetches real generated tasks; see useJobSimulation).
export const MOCK_TASKS: JobPostingFormValues["tasks"] = [
    {
        id: "task-1",
        questionBankId: null,
        taskType: "WRITTEN_ANALYSIS",
        category: "Finance",
        title: "Onboarding Friction Analysis",
        businessProblemDerived: true,
        interfaceType: InterfaceType.RICH_TEXT_COMPOSER,
        interfacePayload: { interfaceType: InterfaceType.RICH_TEXT_COMPOSER, placeholder: null },
        openEndedComponent: {
            decisionAlreadyMade:
                "Draft a short plan for a re-engagement sequence targeting users who stall at the KYC stage.",
        },
        questionPrompt:
            "Draft a short plan for a re-engagement sequence targeting users who stall at the KYC stage. Explain your reasoning for the timing and the content of each message, ensuring you address the specific friction point of secondary documentation.",
        scenarioDescription:
            "From: Sarah Chen (Head of Product)\nSubject: Drop-off at KYC stage\n\nHi, we are seeing a significant spike in drop-offs during the 'Know Your Customer' (KYC) identity verification stage. Data shows that 40% of users who start the process abandon it when asked to upload a secondary proof of address. We need a CRM nudge sequence to address this immediately. Please draft the logic for a three-step re-engagement plan. Consider the timing of the nudges, the channel, and how we handle users who still fail to convert.",
    },
    {
        id: "task-2",
        questionBankId: null,
        taskType: "PRIORITIZATION",
        category: "Finance",
        title: "Retention Strategy Priority",
        businessProblemDerived: true,
        interfaceType: InterfaceType.RICH_TEXT_COMPOSER,
        interfacePayload: { interfaceType: InterfaceType.RICH_TEXT_COMPOSER, placeholder: null },
        openEndedComponent: {
            decisionAlreadyMade:
                "Rank the following CRM interventions in order of priority to mitigate churn risk.",
        },
        questionPrompt:
            "Rank the following CRM interventions in order of priority (1 = highest priority) to mitigate the risk of churn from the Neon Bank launch.",
        scenarioDescription:
            "A major competitor, 'Neon Bank', has just launched a 5.5% AER savings product. This is significantly higher than Ray's current top rate. Our data science team has identified five customer segments that are most likely to churn in response to this news. You need to decide which retention activities to execute first this afternoon.",
    },
    {
        id: "task-3",
        questionBankId: null,
        taskType: "SINGLE_BEST_ACTION",
        category: "Finance",
        title: "Regulatory Compliance Review",
        businessProblemDerived: false,
        interfaceType: InterfaceType.TEXT_AREA,
        interfacePayload: { interfaceType: InterfaceType.TEXT_AREA, placeholder: null },
        objectiveComponent: {
            options: ["Send as-is", "Escalate to Legal", "Add a risk disclaimer", "Pull the campaign"],
            correctOptionIndex: 1,
        },
        questionPrompt:
            "Identify the most critical regulatory issue with the proposed campaign copy and select the best course of action.",
        scenarioDescription:
            "From: James Miller (Legal & Compliance)\nSubject: URGENT: Quick review of 'Boost' campaign copy\n\nWe are about to hit 'send' on a mass campaign for the new Boost Investment product. Given the current market volatility, I need a CRM perspective on this copy to ensure we aren't breaching FCA guidelines on clear, fair, and not misleading promotions.\n\nProposed Copy: 'Stop losing money to inflation. Move your savings to Ray Boost today and guarantee a return on your future. It is the safest way to grow your wealth in 2024. Click here to start.'",
    },
];

export const JOB_POSTING_DEFAULT_VALUES: Partial<JobPostingFormValues> = {
    deadline: "",
    isRemoteFriendly: false,
    skills: [],
    tasks: [],
};
