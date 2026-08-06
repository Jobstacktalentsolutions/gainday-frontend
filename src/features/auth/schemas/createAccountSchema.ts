import { z } from "zod";
import { passwordSchema } from "./passwordRules";

export const createAccountSchema = z
    .object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Enter a valid work email"),
        companyName: z.string().min(1, "Company name is required"),
        password: passwordSchema,
        confirmPassword: z.string(),
        agreedToTerms: z.boolean().refine((v) => v, "you must agree to continue"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match",
        path: ["confirmPassword"],
    })