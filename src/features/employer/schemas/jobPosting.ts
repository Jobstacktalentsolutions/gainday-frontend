import { z } from "zod";
import { InterfaceType } from "@/features/simulation-tasks/types";

export const jobRoleEnum = z.enum(["FINANCE", "SALES"]);
export type JobRole = z.infer<typeof jobRoleEnum>;

export const jobDetailsBaseSchema = z.object({
    title: z.string().min(3, "Job title is required"),
    role: jobRoleEnum,
    skillLevel: z.string().min(1, "Select a skill level"),
    skillCategory: z.string().optional(),
    company: z.string().min(1),
    location: z.string().min(1, "Location is required"),
    employmentType: z.string().min(1, "Select an employment type"),
    deadline: z.string().optional(),
    isRemoteFriendly: z.boolean().default(false),
    salaryFrom: z.preprocess(
        (val) => (val === "" || val === null || val === undefined || (typeof val === "number" && isNaN(val)) ? undefined : val),
        z.coerce.number().positive("Must be greater than 0").optional()
    ),
    salaryTo: z.preprocess(
        (val) => (val === "" || val === null || val === undefined || (typeof val === "number" && isNaN(val)) ? undefined : val),
        z.coerce.number().positive("Must be greater than 0").optional()
    ),
    aiUsePolicy: z.string().optional(),
    companyDescription: z.string().optional(),
    skills: z.array(z.string()).default([]),
    description: z
        .string()
        .min(40, "Give at least 40 characters so Gainday has enough to work with")
        .max(5000, "keep it under 5000 characters"),
    // Optional — the specific business problem this hire should help solve; feeds the AI
    // pipeline's "Problem" extraction separately from `description` (see extraction.node.ts on
    // the backend, which never invents a problem if this is left blank).
    businessProblem: z.string().max(500, "keep it under 500 characters").optional(),
})

//Job details schema refine
export const jobDetailsSchema = jobDetailsBaseSchema.refine(
    (data) => !data.salaryFrom || !data.salaryTo || Number(data.salaryTo) >= Number(data.salaryFrom),
    { message: "Salary to must be greater than salary from", path: ["salaryTo"] }
);

export type JobDetailsFormValues = z.infer<typeof jobDetailsBaseSchema>;




//Simulation builder — mirrors the backend's SimulationTask shape exactly (see
// gainday-backend/src/db/schema/simulations.schema.ts) so tasks round-trip through
// GET/PUT /simulations without a lossy field-mapping layer.
export const simulationTaskSchema = z.object({
    id: z.string(),
    // Null for a task added/regenerated via regenerateTask() that hasn't been accepted +
    // persisted to question_bank yet — it can't be graded until it has one.
    questionBankId: z.string().nullable(),
    taskType: z.string().min(1),
    category: z.string().min(1),
    title: z.string().min(1, "Task title is required"),
    scenarioDescription: z.string().min(1, "Scenario is required"),
    questionPrompt: z.string().min(1, "Task prompt is required"),
    objectiveComponent: z.record(z.string(), z.unknown()).optional(),
    openEndedComponent: z.record(z.string(), z.unknown()).optional(),
    businessProblemDerived: z.boolean(),
    interfaceType: z.nativeEnum(InterfaceType),
    interfacePayload: z.record(z.string(), z.unknown()),
});

export const simulationBuilderSchema = z.object({
    tasks: z.array(simulationTaskSchema).min(1, "Add at least one task"),
});

export type SimulationBuilderFormValues = z.infer<typeof simulationBuilderSchema>;


export const jobPostingSchema = jobDetailsBaseSchema
    .merge(simulationBuilderSchema)
    .refine(
        (data) => !data.salaryFrom || !data.salaryTo || Number(data.salaryTo) >= Number(data.salaryFrom),
        { message: "Salary to must be greater than salary from ", path: ["salaryTo"] }
    )

// export const jobPostingSchema = jobDetailsBaseSchema;
export type JobPostingFormValues = z.infer<typeof jobPostingSchema>;
export type JobPostingFormInput = z.input<typeof jobPostingSchema>;

