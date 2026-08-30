import type { JobPostingFormValues } from "../schemas/jobPosting";

// Mock "AI-generated" content pulled from Figma, standing in for what a real
// generation endpoint will eventually return. Swap this out once Simulation
// Builder actually calls a backend service instead of reading static defaults.

export const MOCK_SCENARIO_INTRO =
    "Welcome to Ray. You are the new CRM Manager. Ray is a growing digital finance platform focused on helping users grow their wealth through automated savings and investment tools. Today is Tuesday, and your inbox is already full of urgent requests following a competitor's new product launch and an ongoing issue with user onboarding flow. You have 20 minutes to address these challenges, focusing on data-driven planning and regulatory compliance.";

export const MOCK_TASKS: JobPostingFormValues["tasks"] = [
    {
        id: "task-1",
        type: "written",
        title: "Onboarding Friction Analysis",
        taskPrompt:
            "Draft a short plan for a re-engagement sequence targeting users who stall at the KYC stage. Explain your reasoning for the timing and the content of each message, ensuring you address the specific friction point of secondary documentation.",
        scenario:
            "From: Sarah Chen (Head of Product)\nSubject: Drop-off at KYC stage\n\nHi, we are seeing a significant spike in drop-offs during the 'Know Your Customer' (KYC) identity verification stage. Data shows that 40% of users who start the process abandon it when asked to upload a secondary proof of address. We need a CRM nudge sequence to address this immediately. Please draft the logic for a three-step re-engagement plan. Consider the timing of the nudges, the channel, and how we handle users who still fail to convert.",
        capabilities: ["Analytical Problem Solving", "Omnichannel Campaign Execution"],
        scores: ["problem_solving", "role_expertise"],
    },
    {
        id: "task-2",
        type: "written",
        title: "Retention Strategy Priority",
        taskPrompt:
            "Rank the following CRM interventions in order of priority (1 = highest priority) to mitigate the risk of churn from the Neon Bank launch.",
        scenario:
            "A major competitor, 'Neon Bank', has just launched a 5.5% AER savings product. This is significantly higher than Ray's current top rate. Our data science team has identified five customer segments that are most likely to churn in response to this news. You need to decide which retention activities to execute first this afternoon.",
        capabilities: ["Retention Strategy Planning", "Data Driven Segmentation"],
        scores: ["judgement", "commercial_awareness"],
    },
    {
        id: "task-3",
        type: "choice",
        title: "Regulatory Compliance Review",
        taskPrompt:
            "Identify the most critical regulatory issue with the proposed campaign copy and select the best course of action.",
        scenario:
            "From: James Miller (Legal & Compliance)\nSubject: URGENT: Quick review of 'Boost' campaign copy\n\nWe are about to hit 'send' on a mass campaign for the new Boost Investment product. Given the current market volatility, I need a CRM perspective on this copy to ensure we aren't breaching FCA guidelines on clear, fair, and not misleading promotions.\n\nProposed Copy: 'Stop losing money to inflation. Move your savings to Ray Boost today and guarantee a return on your future. It is the safest way to grow your wealth in 2024. Click here to start.'",
        capabilities: ["Regulatory Awareness"],
        scores: ["judgement", "role_expertise"],
    },
];

export const JOB_POSTING_DEFAULT_VALUES: Partial<JobPostingFormValues> = {
    company: "Gett", // TODO: pull from authenticated employer's org profile
    deadline: "",
    isRemoteFriendly: false,
    skills: [],
    scenarioIntro: MOCK_SCENARIO_INTRO,
    tasks: MOCK_TASKS,
};