import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
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

/** Saves a single toggle as soon as it changes. The switch flips at once and is rolled back if the
 *  save fails. */
export function useUpdateEmailPreference(token: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (change: Partial<EmailPreferences>) =>
      (await apiClient.patch<EmailPreferences>(`/email-preferences/${token}`, change)).data,
    onMutate: async (change) => {
      await queryClient.cancelQueries({ queryKey: preferencesKey(token) })
      const previous = queryClient.getQueryData<EmailPreferences>(preferencesKey(token))
      queryClient.setQueryData<EmailPreferences>(preferencesKey(token), (current) =>
        current ? { ...current, ...change } : current
      )
      return { previous }
    },
    onError: (_error, _change, context) => {
      queryClient.setQueryData(preferencesKey(token), context?.previous)
      toast.error("Couldn't save your preference. Please try again.")
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(preferencesKey(token), saved)
    },
  })
}
