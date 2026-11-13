import { TriangleAlert } from "lucide-react";

export function TimeWarningBanner() {
    return (
        <div className="fixed left-0 top-16 sm:top-20 lg:top-29.25 z-20 flex w-full items-center justify-center gap-3 border-b border-error-500 bg-error-50 p-3 px-4">
            <TriangleAlert className="size-6 shrink-0 text-error-500" />
            <p className="text-sm sm:text-[16px] text-error-500">
                Less than 5 minutes remain. Complete unfinished answers now; your work will auto-submit at 00:00.
            </p>
        </div>
    );
}
