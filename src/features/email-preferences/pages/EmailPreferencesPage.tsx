import { useSearchParams } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import GaindayMark from "@/components/ui/GaindayMark"
import AppLoader from "@/components/ui/AppLoader"
import {
  useEmailPreferences,
  useUpdateEmailPreference,
  type EmailPreferences,
} from "../hooks/useEmailPreferences"

const OPTIONS: { key: keyof EmailPreferences; label: string; description: string }[] = [
  {
    key: "jobRecommendationsEnabled",
    label: "Job recommendations",
    description: "New jobs that match the job title on your profile.",
  },
  {
    key: "newsletterEnabled",
    label: "Newsletter",
    description: "Occasional news and updates from Gainday.",
  },
]

const EmailPreferencesPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const preferencesQuery = useEmailPreferences(token)
  const updatePreference = useUpdateEmailPreference(token)

  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <GaindayMark width={40} height={46} />
        <h1 className="mt-6 text-xl font-semibold text-primary-950">Email preferences</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Choose which emails you want to receive from Gainday. Changes save automatically.
        </p>

        {preferencesQuery.isPending && token && (
          <div className="mt-8 flex justify-center">
            <AppLoader />
          </div>
        )}

        {(!token || preferencesQuery.isError) && (
          <p role="alert" className="mt-8 text-sm text-destructive">
            This link is no longer valid. Use the most recent email from Gainday to manage your
            preferences.
          </p>
        )}

        {preferencesQuery.isSuccess && (
          <ul className="mt-8 flex flex-col gap-6">
            {OPTIONS.map(({ key, label, description }) => {
              const id = `email-pref-${key}`
              return (
                <li key={key} className="flex items-start gap-3">
                  <Checkbox
                    id={id}
                    checked={preferencesQuery.data[key]}
                    onCheckedChange={(checked) => updatePreference.mutate({ [key]: checked })}
                    className="mt-0.5 cursor-pointer"
                  />
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={id} className="cursor-pointer">
                      {label}
                    </Label>
                    <p className="text-sm text-neutral-600">{description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}

export default EmailPreferencesPage
