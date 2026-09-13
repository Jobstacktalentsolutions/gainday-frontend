export function AuthDivider({ label = "or" }: { label?: string }) {
    return (
        <div className="flex w-full items-center gap-2.5">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-base text-neutral-200">{label}</span>
            <div className="h-px flex-1 bg-neutral-200" />
        </div>
    )
}