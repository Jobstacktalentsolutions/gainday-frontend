import { Checkbox } from "@/components/ui/checkbox"

interface AuthCheckboxRowProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  error?: string
}

export function AuthCheckboxRow({ checked, onCheckedChange, error }: AuthCheckboxRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-invalid={error ? "true" : "false"}
        />
        <p className="text-xs text-primary-950">
          I agree to the{" "}
          <a href="/terms" className="underline">
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
        </p>
      </div>
      {error && (
        <p role="alert" className="text-center text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}