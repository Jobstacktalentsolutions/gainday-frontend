import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "../store/authStore";
import type { Gender, Pronouns } from "../utils/profileOptions";

export interface Profile {
  id: string;
  email: string;
  role: string;
  authProvider?: string;
  profileId?: string;
  fullName?: string;
  companyName?: string;
  phoneNumber?: string;
  gender?: Gender | null;
  pronouns?: Pronouns | null;
  brief?: string | null;
  isProfileComplete?: boolean;
}

export interface UpdateProfilePayload {
  fullName?: string;
  companyName?: string;
  phoneNumber?: string;
  /** `null` clears it. */
  gender?: Gender | null;
  pronouns?: Pronouns;
  brief?: string;
}

const fetchProfile = async (): Promise<Profile> => {
  const { data } = await apiClient.get("/users/profile");
  return data;
};

// Keyed by access token so a cached profile can never outlive its session: signing out and
// logging in as a different user yields a new token, hence a fresh query, instead of
// serving the previous user's profile (and role) from cache.
const profileQueryKey = (accessToken: string | null) => ["auth", "profile", accessToken] as const;

export const useProfile = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: profileQueryKey(accessToken),
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
      queryClient.setQueryData(profileQueryKey(accessToken), updatedProfile);
      setAuth(accessToken, updatedProfile);
    },
  });
};
