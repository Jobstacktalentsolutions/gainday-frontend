import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LockOpen } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { FilterDropdown } from "@/features/candidate/components/Filterdropdown";
import { SearchField } from "@/features/candidate/components/SearchField";
import { formatShortDate } from "@/lib/formatDate";
import { useUnlockHistory } from "../../hooks/useUnlockHistory";
import type { UnlockRecord } from "../../types/billing";
import { DATE_PRESET_OPTIONS, isWithinDatePreset } from "../../utils/dateRange";
import HistoryShell, { ClearFiltersButton } from "./HistoryShell";

const PAGE_SIZE = 10;

const submissionPath = (row: UnlockRecord) => `/employer/jobs/${row.jobId}/submissions/${row.submissionId}`;

const jobLabel = (row: UnlockRecord) => (row.jobTitle ? row.jobTitle : "Job unavailable");

// The candidate's name links to the submission while it still exists. Once it's deleted, the name
// is plain text, so the history row stays and nothing links to a missing page.
const CandidateName = ({ row, className }: { row: UnlockRecord; className: string }) => {
    const name = row.candidateName ? row.candidateName : "Candidate unavailable";
    if (!row.jobId || !row.submissionId) return <span className={className}>{name}</span>;
    return (
        <Link to={submissionPath(row)} className={className}>
            {name}
        </Link>
    );
};

const UnlocksSection = () => {
    const { data, isLoading, isError, refetch } = useUnlockHistory();
    const [query, setQuery] = useState("");
    const [role, setRole] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [visible, setVisible] = useState(PAGE_SIZE);

    const roleOptions = useMemo(
        () =>
            Array.from(new Set((data ?? []).flatMap((row) => (row.jobTitle ? [row.jobTitle] : [])))).map((title) => ({
                value: title,
                label: title,
            })),
        [data],
    );

    const rows = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return (data ?? []).filter(
            (row) =>
                (!role || row.jobTitle === role) &&
                isWithinDatePreset(row.unlockedAt, date) &&
                (!needle || [row.candidateName, row.jobTitle].join(" ").toLowerCase().includes(needle)),
        );
    }, [data, query, role, date]);

    const hasFilters = query.trim() !== "" || role !== null || date !== null;
    const clearFilters = () => {
        setQuery("");
        setRole(null);
        setDate(null);
        setVisible(PAGE_SIZE);
    };

    return (
        <HistoryShell
            title="Unlocks"
            icon={<LockOpen className="size-6" aria-hidden="true" />}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={!isLoading && !isError && (data?.length ?? 0) === 0}
            isFilteredEmpty={rows.length === 0 && (data?.length ?? 0) > 0}
            emptyTitle="No candidates unlocked yet"
            emptyHint="When you spend a credit to unlock a candidate's contact details, it will be listed here."
            onClearFilters={clearFilters}
            filters={
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                    <SearchField
                        value={query}
                        onChange={(value) => { setQuery(value); setVisible(PAGE_SIZE); }}
                        placeholder="Search by name or keyword"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <FilterDropdown
                            allLabel="All Roles"
                            options={roleOptions}
                            selectedValue={role}
                            onSelect={(value) => { setRole(value); setVisible(PAGE_SIZE); }}
                        />
                        <FilterDropdown
                            allLabel="Date"
                            options={DATE_PRESET_OPTIONS}
                            selectedValue={date}
                            onSelect={(value) => { setDate(value); setVisible(PAGE_SIZE); }}
                        />
                    </div>
                    <ClearFiltersButton active={hasFilters} onClick={clearFilters} />
                </div>
            }
        >
            {/* Desktop */}
            <table className="hidden w-full text-left md:table">
                <caption className="sr-only">Unlocked candidates</caption>
                <thead>
                    <tr className="border-b border-neutral-200 text-base uppercase text-neutral-500">
                        <th scope="col" className="pb-3 font-normal">Candidate</th>
                        <th scope="col" className="pb-3 text-center font-normal">Job</th>
                        <th scope="col" className="pb-3 text-center font-normal">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/70 text-base text-neutral-950">
                    {rows.slice(0, visible).map((row) => (
                        <tr key={row.id}>
                            <td className="py-3">
                                <CandidateName row={row} className="underline-offset-2 hover:text-primary-500 hover:underline" />
                            </td>
                            <td className="py-3 text-center">{jobLabel(row)}</td>
                            <td className="py-3 text-center">{formatShortDate(row.unlockedAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile */}
            <ul className="flex flex-col divide-y divide-neutral-200/70 md:hidden">
                {rows.slice(0, visible).map((row) => (
                    <li key={row.id} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
                        <CandidateName row={row} className="text-base text-neutral-950 hover:text-primary-500" />
                        <span className="text-sm text-neutral-500">
                            {jobLabel(row)} · {formatShortDate(row.unlockedAt)}
                        </span>
                    </li>
                ))}
            </ul>

            {rows.length > visible && (
                <ActionButton
                    variant="ghost"
                    size="md"
                    className="mx-auto mt-4 w-auto"
                    onClick={() => setVisible((count) => count + PAGE_SIZE)}
                >
                    Show more
                </ActionButton>
            )}
        </HistoryShell>
    );
};

export default UnlocksSection;