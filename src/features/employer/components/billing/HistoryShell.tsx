import type { ReactNode } from "react";
import { Inbox, XCircle } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import Skeleton from "@/components/ui/skeleton";

export const ClearFiltersButton = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={!active}
        className="cursor-pointer text-base text-primary-500 transition-opacity hover:underline disabled:cursor-default disabled:no-underline disabled:opacity-40"
    >
        Clear filters
    </button>
);

const Panel = ({ icon, title, hint, action }: { icon: ReactNode; title: string; hint?: string; action?: ReactNode }) => (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
        <span className="text-neutral-400" aria-hidden="true">{icon}</span>
        <p className="text-base text-neutral-950">{title}</p>
        {hint && <p className="max-w-sm text-sm text-neutral-500">{hint}</p>}
        {action && <div className="mt-2">{action}</div>}
    </div>
);

interface HistoryShellProps {
    title: string;
    icon: ReactNode;
    filters: ReactNode;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    /** No rows at all. */
    isEmpty: boolean;
    /** Rows exist but none match the filters. */
    isFilteredEmpty: boolean;
    emptyTitle: string;
    emptyHint: string;
    onClearFilters: () => void;
    children: ReactNode;
}

const HistoryShell = ({
    title,
    icon,
    filters,
    isLoading,
    isError,
    onRetry,
    isEmpty,
    isFilteredEmpty,
    emptyTitle,
    emptyHint,
    onClearFilters,
    children,
}: HistoryShellProps) => {
    let body: ReactNode = children;

    if (isLoading) {
        body = (
            <div className="flex flex-col gap-4" aria-busy="true">
                {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i} className="h-10 w-full bg-neutral-100" />
                ))}
            </div>
        );
    } else if (isError) {
        body = (
            <Panel
                icon={<XCircle className="size-8" />}
                title="Couldn't load this"
                hint="Check your connection and try again."
                action={
                    <ActionButton variant="outline" size="md" className="w-auto" onClick={onRetry}>
                        Try again
                    </ActionButton>
                }
            />
        );
    } else if (isEmpty) {
        body = <Panel icon={<Inbox className="size-8" />} title={emptyTitle} hint={emptyHint} />;
    } else if (isFilteredEmpty) {
        body = (
            <Panel
                icon={<Inbox className="size-8" />}
                title="No results match these filters"
                action={
                    <ActionButton variant="outline" size="md" className="w-auto" onClick={onClearFilters}>
                        Clear filters
                    </ActionButton>
                }
            />
        );
    }

    return (
        <section aria-label={title} className="flex flex-col gap-5">
            <div className="flex items-center gap-1">
                {icon}
                <h2 className="text-[28px] leading-[1.2] text-neutral-950">{title}</h2>
            </div>
            {filters}
            <div className="rounded-xl bg-linear-to-br from-secondary-500/50 via-neutral-200 to-primary-500/60 p-px">
                <div className="rounded-[11px] bg-white p-4 sm:p-6">{body}</div>
            </div>
        </section>
    );
};

export default HistoryShell;