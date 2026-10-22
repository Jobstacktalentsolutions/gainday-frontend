import { z } from "zod";

export const signupBonusSchema = z.object({
  enabled: z.boolean(),
  creditAmount: z
    .number({ error: "Enter a number of credits" })
    .int("Use whole credits only")
    .min(0, "Credits cannot be negative"),
});

export type SignupBonusFormValues = z.infer<typeof signupBonusSchema>;
