import { z } from "zod";
import { passwordSchema } from "./passwordRules";

export const resetPasswordSchema = z.object({
    password : passwordSchema,
    confirmPassword : z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path : ["confirmPassword"],
})

export type resetPasswordFormValues = z.infer<typeof resetPasswordSchema>