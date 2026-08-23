import axios from "axios"
import { useAuthStore } from "@/features/auth/store/authStore"

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
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