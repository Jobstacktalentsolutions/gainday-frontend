import { z } from "zod";

export const employerEditSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  companyName: z.string().min(1, "Company name is required"),
  status: z.enum(["active", "pending", "flagged"]),
  isVerified: z.boolean(),
  adminNotes: z.string().optional(),
});

export type EmployerEditFormValues = z.infer<typeof employerEditSchema>;