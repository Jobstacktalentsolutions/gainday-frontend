import { z } from "zod";

export const candidateSignUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreedToTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the Terms & Conditions and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CandidateSignUpValues = z.infer<typeof candidateSignUpSchema>;

export const candidateSignInSchema = z.object({
    email : z.string().trim().email("Enter a valid email address"),
    password : z.string().min(1, "Enter your password"),
})

export type CandidateSignInValues = z.infer<typeof candidateSignInSchema>;
