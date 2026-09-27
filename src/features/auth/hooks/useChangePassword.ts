import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { ChangePasswordFormValues } from "../schemas/changePasswordSchema";

const changePassword = async (values: ChangePasswordFormValues) => {
    const { data } = await apiClient.post("/auth/change-password", values);
    return data;
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
    });
};
