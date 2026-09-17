import type { CandidateSignInValues, CandidateSignUpValues } from "./schema";


interface CandidateAuthResponseBody {
    access_token: string;
    user: {
        id: string;
        email: string;
        role: "JOB_SEEKER"
        profileId: string;
        fullName: string;
    };
    isEmailVerified: boolean;
}

// Mirrors the shape apiClient.post(...) resolves to (an axios response with
// a `.data` body), so swapping in the real call later is a one-line change
// in each mutationFn below — nothing in the components' onSuccess changes.
//
// TODO real calls, once candidate auth endpoints exist:
//   mockCandidateSignUp -> apiClient.post<CandidateAuthResponseBody>("/auth/signup", { ...values, role: "JOB_SEEKER" })
//   mockCandidateSignIn -> apiClient.post<CandidateAuthResponseBody>("/auth/login", values)


function delay<T>(data: T, ms = 600): Promise<{ data: T }> {
    return new Promise((resolve) => setTimeout(() => resolve({ data }), ms));
}

export function mockCandidateSignUp(values: CandidateSignUpValues) {
    return delay<CandidateAuthResponseBody>({
        access_token: "mock-access-token",
        user: {
            id: "mock-user-id",
            email: values.email,
            role: "JOB_SEEKER",
            profileId: "mock-profile-id",
            fullName: values.fullName
        },
        isEmailVerified: true,
    })
}

export function mockCandidateSignIn(values: CandidateSignInValues) {
    return delay<CandidateAuthResponseBody>({
        access_token: "mock-access-token",
        user: {
            id: "mock-user-id",
            email: values.email,
            role: "JOB_SEEKER",
            profileId: "mock-profile-id",
            fullName: "Mock Candidate",

        },
        isEmailVerified: true,
    })
}