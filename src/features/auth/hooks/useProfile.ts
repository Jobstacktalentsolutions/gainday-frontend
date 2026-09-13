import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "../store/authStore";

interface Profile {
  id: string;
  email: string;
  role: string;
  profileId?: string;
  fullName?: string;
  companyName?: string;
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
