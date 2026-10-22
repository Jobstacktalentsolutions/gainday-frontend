import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreditLedger } from "../../hooks/useCredits";
import { TableLoadMore } from "../TableLoadMore";
import { TableSkeleton } from "../skeletons";
import type { CreditLedgerEntry, CreditLedgerType } from "../../types/credits";
import { formatSignedFiat } from "../../utils/money";

type FilterId = "ALL" | CreditLedgerType;

const FILTER_TABS: { id: FilterId; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "SIGNUP_BONUS", label: "Signup bonus" },
  { id: "PURCHASE", label: "Purchases" },
  { id: "UNLOCK", label: "Unlocks" },
];

const TYPE_STYLES: Record<CreditLedgerType, { label: string; className: string }> = {
  SIGNUP_BONUS: { label: "Signup bonus", className: "border-success-200 bg-success-50 text-success-700" },
  PURCHASE: { label: "Purchase", className: "border-primary-200 bg-primary-50 text-primary-700" },
  UNLOCK: { label: "Candidate unlock", className: "border-neutral-200 bg-neutral-100 text-neutral-700" },
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });

const formatAmount = (amount: number) => (amount > 0 ? `+${amount}` : `${amount}`);

const CreditLedgerTable = () => {
  const [filter, setFilter] = useState<FilterId>("ALL");
  const type = filter === "ALL" ? undefined : filter;
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useCreditLedger(type);

  const entries = useMemo<CreditLedgerEntry[]>(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Credit activity</h2>
          <p className="text-xs text-neutral-500">Every grant, purchase and unlock across all employers</p>
        </div>
        <div role="tablist" className="flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                filter === tab.id ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : isError ? (
        <p className="py-8 text-center text-sm text-error-600">Couldn't load credit activity.</p>
      ) : entries.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">No credit activity yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-neutral-600">{formatDate(entry.createdAt)}</TableCell>
                    <TableCell className="font-medium text-neutral-900">{entry.employerName ?? "Unnamed employer"}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                          TYPE_STYLES[entry.type].className,
                        )}
                      >
                        {TYPE_STYLES[entry.type].label}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold tabular-nums",
                        entry.amount > 0 ? "text-success-700" : "text-neutral-600",
                      )}
                    >
                      {formatAmount(entry.amount)}
                    </TableCell>
                    <TableCell
                      className="text-right tabular-nums text-neutral-700"
                      title={entry.fiatIsEstimate && entry.fiatPence !== null ? "Estimated at the average price per credit" : undefined}
                    >
                      {entry.fiatIsEstimate && entry.fiatPence !== null && <span className="text-neutral-400">≈ </span>}
                      {formatSignedFiat(entry.fiatPence, entry.fiatUsd)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <TableLoadMore
            currentCount={entries.length}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </>
      )}
    </section>
  );
};

export default CreditLedgerTable;
