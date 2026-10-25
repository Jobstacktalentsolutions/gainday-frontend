import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface EmailPreferences {
  jobRecommendationsEnabled: boolean
  newsletterEnabled: boolean
}

const preferencesKey = (token: string) => ["email-preferences", token] as const

export function useEmailPreferences(token: string) {
  return useQuery({
    queryKey: preferencesKey(token),
    queryFn: async () =>
      (await apiClient.get<EmailPreferences>(`/email-preferences/${token}`)).data,
    enabled: token.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

/** Saves all the toggles in one request, when the reader presses Save. */
export function useSaveEmailPreferences(token: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (preferences: EmailPreferences) =>
      (await apiClient.patch<EmailPreferences>(`/email-preferences/${token}`, preferences)).data,
    onSuccess: (saved) => {
      queryClient.setQueryData(preferencesKey(token), saved)
    },
  })
}
