import type { ReactNode } from "react"

interface AuthCardProps {
    title: string
    subtitle: string
    children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary-200/50 backdrop-blur-[20px]" />

            <div className="relative flex w-141.5 max-w-[92vw] flex-col items-center gap-15 rounded-2xl bg-white p-12 shadow-lg">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">
                        {title}
                    </h1>
                    <p className="text-base text-neutral-700">{subtitle}</p>
                </div>

                <div className="flex w-full flex-col gap-4">{children}</div>
            </div>
        </div>
    )
}