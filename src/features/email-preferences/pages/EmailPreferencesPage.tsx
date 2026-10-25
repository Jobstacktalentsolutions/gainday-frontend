import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import GaindayMark from "@/components/ui/GaindayMark"
import AppLoader from "@/components/ui/AppLoader"
import {
  useEmailPreferences,
  useSaveEmailPreferences,
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
  const savePreferences = useSaveEmailPreferences(token)

  // Edits stay local until Save is pressed. `draft` is null until the saved settings have loaded.
  const [draft, setDraft] = useState<EmailPreferences | null>(null)
  const [status, setStatus] = useState<"idle" | "saved">("idle")

  useEffect(() => {
    if (preferencesQuery.data) setDraft(preferencesQuery.data)
  }, [preferencesQuery.data])

  const saved = preferencesQuery.data
  const hasChanges =
    draft !== null &&
    saved !== undefined &&
    (draft.jobRecommendationsEnabled !== saved.jobRecommendationsEnabled ||
      draft.newsletterEnabled !== saved.newsletterEnabled)

  const toggle = (key: keyof EmailPreferences, checked: boolean) => {
    if (!draft) return
    setDraft({ ...draft, [key]: checked })
    setStatus("idle")
  }

  const handleSave = () => {
    if (!draft) return
    savePreferences.mutate(draft, {
      onSuccess: () => setStatus("saved"),
    })
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <GaindayMark width={40} height={46} />
        <h1 className="mt-6 text-xl font-semibold text-primary-950">Email preferences</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Choose which emails you want to receive from Gainday.
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

        {draft && (
          <>
            <ul className="mt-8 flex flex-col gap-6">
              {OPTIONS.map(({ key, label, description }) => {
                const id = `email-pref-${key}`
                return (
                  <li key={key} className="flex items-start gap-3">
                    <Checkbox
                      id={id}
                      checked={draft[key]}
                      onCheckedChange={(checked) => toggle(key, checked)}
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

            <div className="mt-8 flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || savePreferences.isPending}
              >
                {savePreferences.isPending ? "Saving..." : "Save preferences"}
              </Button>

              {savePreferences.isError && (
                <p role="alert" className="text-sm text-destructive">
                  We couldn't save your preferences. Please try again.
                </p>
              )}
              {status === "saved" && !hasChanges && (
                <p role="status" className="text-sm text-neutral-600">
                  Your email preferences have been updated. You can close this page.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default EmailPreferencesPage
