import { cn } from "@/lib/utils";
import type { PurchaseRecord } from "../../types/billing";

const resolveStatus = ({ status, pricePence }: Pick<PurchaseRecord, "status" | "pricePence">) => {
    if (status === "SUCCEEDED" && pricePence === 0) {
        return { label: "Free (launch)", className: "bg-warning-50 text-warning-500" };
    }
    switch (status) {
        case "SUCCEEDED":
            return { label: "Successful", className: "bg-success-50 text-success-500" };
        case "FAILED":
            return { label: "Failed", className: "bg-error-50 text-error-500" };
        case "PENDING":
            return { label: "Pending", className: "bg-primary-50 text-primary-500" };
    }
};

const PurchaseStatusPill = ({ record }: { record: Pick<PurchaseRecord, "status" | "pricePence"> }) => {
    const { label, className } = resolveStatus(record);
    return (
        <span
            className={cn(
                "inline-flex min-w-30.5 items-center justify-center whitespace-nowrap rounded-xl px-4 py-0.5 text-base",
                className,
            )}
        >
            {label}
        </span>
    );
};

export default PurchaseStatusPill;