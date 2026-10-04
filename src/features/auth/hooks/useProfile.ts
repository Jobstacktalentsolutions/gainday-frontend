import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "../store/authStore";

export interface Profile {
  id: string;
  email: string;
  role: string;
  authProvider?: string;
  profileId?: string;
  fullName?: string;
  companyName?: string;
  phoneNumber?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  companyName?: string;
  phoneNumber?: string;
}

const fetchProfile = async (): Promise<Profile> => {
  const { data } = await apiClient.get("/users/profile");
  return data;
};

export const useProfile = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: fetchProfile,
    enabled: !!accessToken,
    staleTime: 60_000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload): Promise<Profile> => {
      const { data } = await apiClient.patch("/users/profile", payload);
      return data;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["auth", "profile"], updatedProfile);
      setAuth(accessToken, updatedProfile);
    },
  });
};
