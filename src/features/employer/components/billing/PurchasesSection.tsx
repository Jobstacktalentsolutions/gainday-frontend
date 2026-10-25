import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { FilterDropdown } from "@/features/candidate/components/Filterdropdown";
import { formatShortDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import { usePurchaseHistory } from "../../hooks/usePurchaseHistory";
import type { PurchaseRecord } from "../../types/billing";
import { DATE_PRESET_OPTIONS, isWithinDatePreset } from "../../utils/dateRange";
import HistoryShell, { ClearFiltersButton } from "./HistoryShell";
import PurchaseStatusPill from "./PurchaseStatusPill";

const PAGE_SIZE = 10;

const PriceCell = ({ record }: { record: PurchaseRecord }) =>
    record.pricePence === 0 && record.listPricePence > 0 ? (
        <span className="whitespace-nowrap">
            <span className="text-neutral-500 line-through">{formatPrice(record.listPricePence)}</span>{" "}
            <span>{formatPrice(0)}</span>
        </span>
    ) : (
        <span>{formatPrice(record.pricePence)}</span>
    );

const ReceiptLink = ({ url }: { url?: string | null }) =>
    url ? (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary-500"
        >
            Receipt
        </a>
    ) : null;

const PurchasesSection = () => {
    const { data, isLoading, isError, refetch } = usePurchaseHistory();
    const [pack, setPack] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [visible, setVisible] = useState(PAGE_SIZE);

    const packOptions = useMemo(
        () => Array.from(new Set((data ?? []).map((row) => row.packName))).map((name) => ({ value: name, label: name })),
        [data],
    );

    const rows = useMemo(
        () =>
            (data ?? []).filter(
                (row) => (!pack || row.packName === pack) && isWithinDatePreset(row.createdAt, date),
            ),
        [data, pack, date],
    );

    const hasFilters = pack !== null || date !== null;
    const clearFilters = () => {
        setPack(null);
        setDate(null);
        setVisible(PAGE_SIZE);
    };

    return (
        <HistoryShell
            title="Purchases"
            icon={<ShoppingBag className="size-6" aria-hidden="true" />}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            isEmpty={!isLoading && !isError && (data?.length ?? 0) === 0}
            isFilteredEmpty={rows.length === 0 && (data?.length ?? 0) > 0}
            emptyTitle="No purchases yet"
            emptyHint="Packs you buy will show up here, with a receipt for each one."
            onClearFilters={clearFilters}
            filters={
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <FilterDropdown
                            allLabel="Pack Type"
                            options={packOptions}
                            selectedValue={pack}
                            onSelect={(value) => { setPack(value); setVisible(PAGE_SIZE); }}
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
                <caption className="sr-only">Purchase history</caption>
                <thead>
                    <tr className="border-b border-neutral-200 text-base uppercase text-neutral-500">
                        <th scope="col" className="pb-3 font-normal">Pack</th>
                        <th scope="col" className="pb-3 text-center font-normal">Credits added</th>
                        <th scope="col" className="pb-3 text-center font-normal">Price</th>
                        <th scope="col" className="pb-3 text-center font-normal">Date</th>
                        <th scope="col" className="pb-3 text-center font-normal">Status</th>
                        <th scope="col" className="pb-3 text-right font-normal"><span className="sr-only">Receipt</span></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/70 text-base text-neutral-950">
                    {rows.slice(0, visible).map((row) => (
                        <tr key={row.id}>
                            <td className="py-3">{row.packName}</td>
                            <td className="py-3 text-center">+{row.creditsAdded}</td>
                            <td className="py-3 text-center"><PriceCell record={row} /></td>
                            <td className="py-3 text-center">{formatShortDate(row.createdAt)}</td>
                            <td className="py-3 text-center"><PurchaseStatusPill record={row} /></td>
                            <td className="py-3 text-right"><ReceiptLink url={row.receiptUrl} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile */}
            <ul className="flex flex-col divide-y divide-neutral-200/70 md:hidden">
                {rows.slice(0, visible).map((row) => (
                    <li key={row.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-base text-neutral-950">{row.packName} · +{row.creditsAdded}</span>
                            <PurchaseStatusPill record={row} />
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm text-neutral-500">
                            <span>
                                <PriceCell record={row} />
                                {" · "}
                                {formatShortDate(row.createdAt)}
                            </span>
                            <ReceiptLink url={row.receiptUrl} />
                        </div>
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

export default PurchasesSection;