import { useState } from "react";

interface SignUpPayload {
    fullName: string;
    email: string;
    password: string;
}

interface SignInPayload {
    email: string;
    password: string;
}


// TODO: replace with real calls once candidate auth endpoints exist.
export function useCandidateAuth() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function signUp(payload: SignUpPayload) {
        setIsSubmitting(true);
        console.log("TODO: POST /auth/candidate/signup", payload);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsSubmitting(false);
    }

    async function signIn(payload: SignInPayload) {
        setIsSubmitting(true);
        console.log("TODO: POST /auth/candidate/signin", payload);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsSubmitting(false);
    }

    return { isSubmitting, signUp, signIn };
}