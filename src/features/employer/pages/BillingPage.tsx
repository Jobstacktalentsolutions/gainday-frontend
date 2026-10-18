import { Receipt } from "lucide-react";
import { useCreditBalance } from "../hooks/useCreditBalance";
import { formatShortDate } from "@/lib/formatDate";

// Placeholder — purchase history, invoices and payment-method management aren't built yet. Links
// to here already exist (CreditIndicator) so there's somewhere to land rather than a dead link.
const BillingPage = () => {
    const { data } = useCreditBalance();
    const lastRecharged = data?.lastRechargedAt ? formatShortDate(data.lastRechargedAt) : "Never";

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-10 pt-40 lg:px-12 xl:px-20">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                    <Receipt className="size-7" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-950">Billing</h1>
                <p className="max-w-md text-base text-neutral-500">
                    Purchase history, invoices and payment methods are coming soon. For now, here&apos;s
                    where things stand.
                </p>
                <div className="mt-4 flex gap-8">
                    <div className="flex flex-col gap-1">
                        <p className="text-3xl font-bold text-neutral-950">{data?.balance ?? 0}</p>
                        <p className="text-sm text-neutral-500">Credits available</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-3xl font-bold text-neutral-950">{lastRecharged}</p>
                        <p className="text-sm text-neutral-500">Last recharged</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
