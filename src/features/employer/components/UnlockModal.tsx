import { useEffect, useRef, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";
import { cn } from "@/lib/utils";
import { getStripe } from "@/lib/stripe";
import { useCreditPacks } from "../hooks/useCreditPacks";
import { usePurchasePack } from "../hooks/usePurchasePack";
import { usePurchaseStatus } from "../hooks/usePurchaseStatus";
import { useUnlockCandidates } from "../hooks/useUnlockCandidates";
import type { UnlockResult } from "../types/payments";

// Stops polling and shows a "still confirming" message if the webhook never lands — e.g. local
// dev without `stripe listen` running. The purchase itself is unaffected; the employer can just
// retry the unlock later for free.
const CONFIRM_TIMEOUT_MS = 30_000;

type Step = "select" | "checkout" | "confirming" | "error";

interface UnlockModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    submissionIds: string[];
    recommendedPackId?: string;
    onUnlocked: (result: UnlockResult) => void;
}

const formatPrice = (pricePence: number) => {
    const pounds = pricePence / 100;
    return `£${pounds % 1 === 0 ? pounds.toFixed(0) : pounds.toFixed(2)}`;
};

const UnlockModal = ({ open, onOpenChange, submissionIds, recommendedPackId, onUnlocked }: UnlockModalProps) => {
    const [step, setStep] = useState<Step>("select");
    const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
    const [purchaseId, setPurchaseId] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const hasRetriedUnlock = useRef(false);
    const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const packsQuery = useCreditPacks();
    const purchasePack = usePurchasePack();
    const unlockCandidates = useUnlockCandidates();
    const purchaseStatus = usePurchaseStatus(purchaseId, step === "confirming");

    useEffect(() => {
        if (open) {
            setStep("select");
            setSelectedPackId(recommendedPackId ?? null);
            setPurchaseId(null);
            setClientSecret(null);
            setErrorMessage("");
            hasRetriedUnlock.current = false;
        }
        // Only re-sync when the modal is opened for a (possibly new) unlock attempt.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Derived at render time rather than synced via an effect: once packs load, fall back to the
    // recommended/most-popular/first pack until the employer picks one themselves.
    const effectivePackId =
        selectedPackId ??
        (packsQuery.data &&
            (packsQuery.data.find((pack) => pack.id === recommendedPackId) ??
                packsQuery.data.find((pack) => pack.label) ??
                packsQuery.data[0])?.id) ??
        null;

    useEffect(() => {
        if (step !== "confirming") {
            if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
            return;
        }
        confirmTimeoutRef.current = setTimeout(() => {
            setStep("error");
            setErrorMessage(
                "Still confirming your payment. This can take a little longer than usual — check back shortly, your credits will apply automatically once it completes.",
            );
        }, CONFIRM_TIMEOUT_MS);
        return () => {
            if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
        };
    }, [step]);

    useEffect(() => {
        const status = purchaseStatus.data?.status;
        if (step !== "confirming" || !status || hasRetriedUnlock.current) return;

        if (status === "SUCCEEDED") {
            hasRetriedUnlock.current = true;
            unlockCandidates.mutate(submissionIds, {
                onSuccess: (result) => {
                    toast.success("Credits purchased — contact unlocked");
                    onUnlocked(result);
                    onOpenChange(false);
                },
                onError: () => {
                    setStep("error");
                    setErrorMessage(
                        "Payment succeeded but unlocking the contact failed. Your credits are safe — try unlocking again.",
                    );
                },
            });
        } else if (status === "FAILED") {
            hasRetriedUnlock.current = true;
            setStep("error");
            setErrorMessage("The payment didn't go through. No credits were charged — you can try again.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [purchaseStatus.data?.status, step]);

    const handlePayAndUnlock = () => {
        if (!effectivePackId) return;
        purchasePack.mutate(effectivePackId, {
            onSuccess: ({ purchaseId: newPurchaseId, clientSecret: newClientSecret }) => {
                setPurchaseId(newPurchaseId);
                setClientSecret(newClientSecret);
                setStep("checkout");
            },
            onError: () => {
                toast.error("Couldn't start checkout. Please try again.");
            },
        });
    };

    const handleRetry = () => {
        hasRetriedUnlock.current = false;
        setPurchaseId(null);
        setStep("select");
    };

    const packCount = submissionIds.length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg gap-6 rounded-2xl p-7">
                {step === "select" && (
                    <>
                        <DialogTitle>Buy credits to unlock contact</DialogTitle>
                        <DialogDescription>
                            {packCount === 1
                                ? "1 credit will be spent to unlock this candidate's contact details."
                                : `${packCount} credits will be spent to unlock these candidates' contact details.`}
                        </DialogDescription>

                        {packsQuery.isLoading && (
                            <div className="flex justify-center py-6">
                                <Loader2 className="size-6 animate-spin text-neutral-400" aria-hidden="true" />
                            </div>
                        )}

                        {packsQuery.data && (
                            <div className="flex flex-col gap-3">
                                {packsQuery.data.map((pack) => {
                                    const isSelected = pack.id === effectivePackId;
                                    return (
                                        <button
                                            key={pack.id}
                                            type="button"
                                            onClick={() => setSelectedPackId(pack.id)}
                                            className={cn(
                                                "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all cursor-pointer",
                                                isSelected
                                                    ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                                                    : "border-neutral-200 hover:border-primary-300",
                                            )}
                                        >
                                            <div className="flex flex-col">
                                                <span className="flex items-center gap-2 text-sm font-medium text-neutral-950">
                                                    {pack.name}
                                                    {pack.label && (
                                                        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                                                            {pack.label}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-xs text-neutral-500">
                                                    {pack.credits} unlock{pack.credits === 1 ? "" : "s"}
                                                </span>
                                            </div>
                                            <span className="text-base font-semibold text-neutral-950">
                                                {formatPrice(pack.pricePence)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <ActionButton
                            size="lg"
                            onClick={handlePayAndUnlock}
                            disabled={!effectivePackId || purchasePack.isPending}
                        >
                            {purchasePack.isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                    Starting checkout...
                                </>
                            ) : (
                                "Pay and unlock"
                            )}
                        </ActionButton>
                    </>
                )}

                {step === "checkout" && clientSecret && (
                    <>
                        <DialogTitle>Complete payment</DialogTitle>
                        <DialogDescription>
                            Your credits will apply automatically once payment completes — you won't leave this page.
                        </DialogDescription>
                        <div className="max-h-[70vh] overflow-y-auto">
                            <EmbeddedCheckoutProvider
                                stripe={getStripe()}
                                options={{
                                    clientSecret,
                                    onComplete: () => setStep("confirming"),
                                }}
                            >
                                <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                        </div>
                    </>
                )}

                {step === "confirming" && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <Loader2 className="size-8 animate-spin text-primary-500" aria-hidden="true" />
                        <DialogTitle>Confirming payment...</DialogTitle>
                        <DialogDescription>This usually takes a few seconds.</DialogDescription>
                    </div>
                )}

                {step === "error" && (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <XCircle className="size-10 text-error-500" aria-hidden="true" />
                        <DialogTitle>Something went wrong</DialogTitle>
                        <DialogDescription>{errorMessage}</DialogDescription>
                        <ActionButton size="lg" onClick={handleRetry}>
                            Try again
                        </ActionButton>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UnlockModal;
