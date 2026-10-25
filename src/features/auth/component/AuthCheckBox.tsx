import { Checkbox } from "@/components/ui/checkbox"

interface AuthCheckboxRowProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  error?: string
  audience? : "candidate" | "employer"
}

export function AuthCheckboxRow({ checked, onCheckedChange, error, audience = "candidate" }: AuthCheckboxRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-invalid={error ? "true" : "false"}
          className="cursor-pointer"
        />
        <p className="text-xs text-primary-950">
          I agree to the{" "}
          <a href= {`/terms/${audience}`} target="_blank" rel="noopener noreferrer" className="underline">
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a href={`/privacy/${audience}`} target="_blank" rel="noopener" className="underline">
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