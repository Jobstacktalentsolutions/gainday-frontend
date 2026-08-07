import { z } from "zod";

export const forgetPasswordSchema = z.object({
    email: z.string().email("Enter a valid email address"),
})

export type forgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>