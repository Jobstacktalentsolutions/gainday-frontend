import { z } from "zod";

export const jobDetailsBaseSchema = z.object({
    title: z.string().min(3, "Job title is required"),
    roleCategory: z.string().min(1, "Select a role category"),
    skillLevel: z.string().min(1, "Select a skill level"),
    company: z.string().min(1),
    location: z.string().min(1, "Location is required"),
    employmentType: z.string().min(1, "Select an employment type"),
    isRemoteFriendly: z.boolean().default(false),
    salaryFrom: z.coerce.number().positive().optional(),
    salaryTo: z.coerce.number().positive().optional(),
    companyDescription: z.string().optional(),
    roleDescription: z.string().optional(),
    skills: z.array(z.string()).default([]),
    simulationBrief: z
        .string()
        .min(40, "Give at least 40 characters so Gainday has enough to work with")
        .max(350, "keep it under 350 characters"),
    estimatedCompletionTime: z.string().min(1, "Select an estimated time"),
    aiUsePolicy: z.string().min(1, "Select an AI use policy"),
})

//Job details schema refine
export const jobDetailsSchema = jobDetailsBaseSchema.refine(
    (data) => !data.salaryFrom || !data.salaryTo || data.salaryTo >= data.salaryFrom,
    { message: "Salary to must be greater than salary from", path: ["salaryTo"] }
);

export type JobDetailsFormValues = z.infer<typeof jobDetailsBaseSchema>;




//Simulation builder
export const taskTypeEnum = z.enum(["written", "choice"])
export type taskTypeEnum = z.infer<typeof taskTypeEnum>;

export const simulationTaskSchema = z.object({
    id: z.string(),
    type: taskTypeEnum,
    title: z.string().min(1, "Task title is required"),
    taskPrompt: z.string().min(1, "Task prompt is required"),
    scenario: z.string().min(1, "Scenario context is required"),
    capabilities: z.array(z.string()).default([]),
    scores: z.array(z.string()).default([]),
});

export type SimulationTask = z.infer<typeof simulationTaskSchema>;

const simulationBuilderBaseSchema = z.object({
    scenarioIntro: z.string().min(1, "Scenario intro is required"),
    tasks: z.array(simulationTaskSchema).min(1, "Add at least one task"),
});

export type SimulationBuilderFormValues = z.infer<typeof simulationBuilderBaseSchema>;


export const jobPostingSchema = jobDetailsBaseSchema
    .merge(simulationBuilderBaseSchema)
    .refine(
        (data) => !data.salaryFrom || !data.salaryTo || data.salaryTo >= data.salaryFrom,
        { message: "Salary to must be greater than salary from ", path: ["salaryTo"] }
    )

// export const jobPostingSchema = jobDetailsBaseSchema;
export type JobPostingFormValues = z.infer<typeof jobPostingSchema>;
export type JobPostingFormInput = z.input<typeof jobPostingSchema>;

