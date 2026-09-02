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
        if (error.response?.status === 401) {
            useAuthStore.getState().clearAuth()
            window.location.href = '/employer/signin'
        }
        return Promise.reject(error)
    },
)