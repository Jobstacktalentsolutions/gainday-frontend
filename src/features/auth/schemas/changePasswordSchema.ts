import { z } from "zod";
import { passwordSchema } from "./passwordRules";

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Enter your current password"),
        newPassword: passwordSchema,
        confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
