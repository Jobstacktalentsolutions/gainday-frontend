import axios from "axios"
import { useAuthStore } from "@/features/auth/store/authStore"

export const getBaseURL = () => {
    const url = import.meta.env.VITE_API_BASE_URL
    if (!url) return ""
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`
}

export const apiClient = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || ""
        const isLoginRequest = requestUrl.includes("/auth/login")

        // The backend blocks unverified employers and job seekers from every app route. Send them to
        // the verification screen, which can resend the link and then return them to where they were.
        // For login requests, let the sign-in mutation onError handler navigate via React Router.
        const isEmailNotVerified =
            error.response?.status === 403 &&
            (error.response?.data?.code === "EMAIL_NOT_VERIFIED" ||
                error.response?.data?.emailVerified === false ||
                error.response?.data?.isEmailVerified === false)

        if (isEmailNotVerified && !isLoginRequest) {
            const role = error.response?.data?.role || useAuthStore.getState().user?.role
            const verifyPath =
                role === "JOB_SEEKER"
                    ? "/candidate/verify-email"
                    : "/employer/verify-email"
            if (!window.location.pathname.startsWith(verifyPath)) {
                window.location.href = verifyPath
            }
        }

        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || ""
            const isAuthRequest =
                requestUrl.includes("/auth/login") ||
                requestUrl.includes("/auth/signup") ||
                requestUrl.includes("/auth/register") ||
                requestUrl.includes("/auth/google")

            if (!isAuthRequest) {
                useAuthStore.getState().clearAuth()
                const isAuthPage =
                    window.location.pathname.includes("/signin") ||
                    window.location.pathname.includes("/signup") ||
                    window.location.pathname.includes("/login")
                if (!isAuthPage) {
                    const isCandidateArea =
                        window.location.pathname.startsWith("/candidate") ||
                        window.location.pathname.startsWith("/job-board")
                    window.location.href = isCandidateArea ? "/candidate/signin" : "/employer/signin"
                }
            }
        }
        return Promise.reject(error)
    },
)