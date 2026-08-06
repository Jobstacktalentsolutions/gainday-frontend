import { z } from "zod";

export const passwordRules = [
    { label: "Must be at least 8 characters", text: (v: string) => v.length >= 8 },
    { label: "Lower case", test: (v: string) => /[a-z]/.test(v) },
    { label: "Upper case", test: (v: string) => /[A-Z]/.test(v) },
    { label: "One special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
    { label: "Digit", test: (v: string) => /[0-9]/.test(v) }
]