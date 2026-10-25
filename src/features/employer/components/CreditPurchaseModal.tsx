import { useEffect, useRef, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import { Info, Loader2, Sparkles, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";
import { getStripe } from "@/lib/stripe";
import { formatExactPrice, formatPrice, perUnlockPence } from "@/lib/formatPrice";
import successAnimation from "@/assets/successAnimation.gif";
import { useClaimFreePack } from "../hooks/useClaimFreePack";
import { creditBalanceQueryKey, useCreditBalance } from "../hooks/useCreditBalance";
import { useCreditPacks } from "../hooks/useCreditPacks";
import { purchaseHistoryQueryKey } from "../hooks/usePurchaseHistory";
import { usePurchasePack } from "../hooks/usePurchasePack";
import { usePurchaseStatus } from "../hooks/usePurchaseStatus";
import { useUnlockCandidates } from "../hooks/useUnlockCandidates";
import type { CreditPack, UnlockResult } from "../types/payments";
import { findPack, getLaunchOfferPack, pluralise } from "../utils/packs";
import PackOption from "./PackOption";

// Stops polling and shows a "still confirming" message if the webhook never lands — e.g. local
// dev without `stripe listen` running. The purchase itself is unaffected; the employer can just
// retry the unlock later for free.
const CONFIRM_TIMEOUT_MS = 30_000;

type Step = "select" | "checkout" | "confirming" | "success" | "error";

interface CreditPurchaseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** "buy" = Billing page; "unlock" = opened after a 402 while unlocking candidates. */
    mode: "buy" | "unlock";
    /** Unlock mode: the submissions to unlock once credits are in. */
    submissionIds?: string[];
    /** Preselected pack: a backend pack id (from the 402) or a pack name like "starter". */
    recommendedPackId?: string;
    onUnlocked?: (result: UnlockResult) => void;
}

const titleClass = "text-[32px] font-normal leading-9.5 tracking-[-0.32px] text-primary-950";

const CreditPurchaseModal = ({
    open,
    onOpenChange,
    mode,
    submissionIds = [],
    recommendedPackId,
    onUnlocked,
}: CreditPurchaseModalProps) => {
    const [step, setStep] = useState<Step>("select");
    const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
    const [purchaseId, setPurchaseId] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [purchasedPack, setPurchasedPack] = useState<CreditPack | null>(null);
    const [claimedFree, setClaimedFree] = useState(false);
    const [unlockResult, setUnlockResult] = useState<UnlockResult | null>(null);
    const [canRetryUnlock, setCanRetryUnlock] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const hasRetriedUnlock = useRef(false);
    const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const queryClient = useQueryClient();
    const packsQuery = useCreditPacks();
    const balanceQuery = useCreditBalance();
    const purchasePack = usePurchasePack();
    const claimFreePack = useClaimFreePack();
    const unlockCandidates = useUnlockCandidates();
    const purchaseStatus = usePurchaseStatus(purchaseId, step === "confirming");

    const packs = packsQuery.data;
    const balance = balanceQuery.data?.balance ?? 0;
    const needed = mode === "unlock" ? submissionIds.length : 0;
    const isWorking = purchasePack.isPending || claimFreePack.isPending || unlockCandidates.isPending;

    // Launch offer: Starter only. Skipped when claiming it still wouldn't cover the unlock.
    const offerPack = balanceQuery.data?.freePackAvailable && packs ? getLaunchOfferPack(packs) : null;
    const offerActive = !!offerPack && (mode === "buy" || balance + offerPack.credits >= needed);

    // A pack that can't cover every candidate being unlocked would lead to paying and then
    // hitting the same 402 again, so it's disabled instead.
    const isUsable = (pack: CreditPack) => {
        if (offerActive) return pack.id === offerPack?.id;
        if (mode === "unlock") return balance + pack.credits >= needed;
        return true;
    };

    const usablePacks = (packs ?? []).filter(isUsable);
    const preferredId = selectedPackId ?? findPack(packs, recommendedPackId)?.id ?? packs?.find((p) => p.label)?.id;
    const selectedPack =
        usablePacks.find((pack) => pack.id === preferredId) ??
        usablePacks.find((pack) => pack.label) ??
        usablePacks[0] ??
        null;

    useEffect(() => {
        if (open) {
            setStep("select");
            setSelectedPackId(null);
            setPurchaseId(null);
            setClientSecret(null);
            setPurchasedPack(null);
            setClaimedFree(false);
            setUnlockResult(null);
            setCanRetryUnlock(false);
            setErrorMessage("");
            hasRetriedUnlock.current = false;
        }
        // Only re-sync when the modal is opened for a (possibly new) attempt.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

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

    const runUnlock = () => {
        unlockCandidates.mutate(submissionIds, {
            onSuccess: (result) => {
                onUnlocked?.(result);
                setUnlockResult(result);
                setStep("success");
            },
            onError: () => {
                // The credits are already in the account, so "Try again" must re-run the unlock
                // rather than send the employer back to buy another pack.
                setCanRetryUnlock(true);
                setStep("error");
                setErrorMessage("Your credits are safe, but unlocking the contact failed. Please try unlocking again.");
            },
        });
    };

    useEffect(() => {
        const status = purchaseStatus.data?.status;
        if (step !== "confirming" || !status || hasRetriedUnlock.current) return;

        if (status === "SUCCEEDED") {
            hasRetriedUnlock.current = true;
            queryClient.invalidateQueries({ queryKey: creditBalanceQueryKey });
            queryClient.invalidateQueries({ queryKey: purchaseHistoryQueryKey });
            if (mode === "unlock") runUnlock();
            else setStep("success");
        } else if (status === "FAILED") {
            hasRetriedUnlock.current = true;
            queryClient.invalidateQueries({ queryKey: purchaseHistoryQueryKey });
            setStep("error");
            setErrorMessage("The payment didn't go through. No credits were charged — you can try again.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [purchaseStatus.data?.status, step]);

    const handleConfirm = () => {
        if (!selectedPack) return;

        if (offerActive) {
            claimFreePack.mutate(selectedPack.id, {
                onSuccess: () => {
                    setPurchasedPack(selectedPack);
                    setClaimedFree(true);
                    if (mode === "unlock") runUnlock();
                    else setStep("success");
                },
                onError: () => toast.error("Couldn't claim the launch offer. Please try again."),
            });
            return;
        }

        purchasePack.mutate(selectedPack.id, {
            onSuccess: ({ purchaseId: newPurchaseId, clientSecret: newClientSecret }) => {
                setPurchaseId(newPurchaseId);
                setClientSecret(newClientSecret);
                setPurchasedPack(selectedPack);
                setStep("checkout");
            },
            onError: () => toast.error("Couldn't start checkout. Please try again."),
        });
    };

    const handleRetry = () => {
        if (canRetryUnlock) {
            setCanRetryUnlock(false);
            setStep("confirming");
            runUnlock();
            return;
        }
        hasRetriedUnlock.current = false;
        setPurchaseId(null);
        setStep("select");
    };

    const detailFor = (pack: CreditPack) => {
        const perUnlock = `${formatExactPrice(perUnlockPence(pack.pricePence, pack.credits))} per unlock`;
        if (offerActive && pack.id !== offerPack?.id) return `${perUnlock} · not part of the launch offer`;
        if (mode === "unlock") {
            const total = balance + pack.credits;
            if (total < needed) return `${perUnlock} · covers ${total} of ${needed}`;
            return `${perUnlock} · ${pluralise(total - needed, "credit")} left after`;
        }
        return perUnlock;
    };

    const ctaLabel = (() => {
        if (offerActive) return "Claim free credit";
        if (!selectedPack) return mode === "unlock" ? "Pay to Unlock" : "Pay";
        const price = formatPrice(selectedPack.pricePence);
        if (mode === "buy") return `Pay ${price}`;
        return `Pay ${price} and unlock ${needed === 1 ? "one candidate" : `${needed} candidates`}`;
    })();

    const title = mode === "buy" ? "Buy Credits" : `Unlock ${pluralise(needed, "candidate")}`;
    const description =
        mode === "buy"
            ? "Pay to unlock candidates details"
            : `You need ${pluralise(needed, "credit")} and have ${balance}. Pick a pack to unlock now.`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] gap-10 overflow-y-auto rounded-2xl p-6 sm:max-w-141.5 sm:p-12">
                {step === "select" && (
                    <>
                        <div className="flex flex-col gap-2">
                            <DialogTitle className={titleClass}>{title}</DialogTitle>
                            <DialogDescription className="text-base text-neutral-700">{description}</DialogDescription>
                        </div>

                        {packsQuery.isLoading && (
                            <div className="flex justify-center py-6">
                                <Loader2 className="size-6 animate-spin text-neutral-400" aria-hidden="true" />
                            </div>
                        )}

                        {packsQuery.isError && (
                            <div className="flex flex-col items-center gap-3 py-4 text-center text-base text-neutral-700">
                                Couldn&apos;t load the credit packs.
                                <ActionButton variant="outline" size="md" className="w-auto" onClick={() => packsQuery.refetch()}>
                                    Try again
                                </ActionButton>
                            </div>
                        )}

                        {packs && (
                            <div role="radiogroup" aria-label="Credit packs" className="flex flex-col gap-3">
                                {packs.map((pack) => (
                                    <PackOption
                                        key={pack.id}
                                        name={pack.name}
                                        credits={pack.credits}
                                        priceLabel={formatPrice(pack.pricePence)}
                                        detail={detailFor(pack)}
                                        badge={pack.label}
                                        selected={pack.id === selectedPack?.id}
                                        disabled={!isUsable(pack)}
                                        onSelect={() => setSelectedPackId(pack.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {offerActive ? (
                            <div className="flex items-center gap-3 border-l-3 border-primary-500 bg-primary-50 p-4 text-base text-primary-950">
                                <Info className="size-5 shrink-0 text-primary-500" aria-hidden="true" />
                                Launch offer: your first pack is free.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5 border-l-3 border-primary-500 bg-primary-50 p-4">
                                <p className="text-base text-primary-950">Credits are one off and never expire</p>
                                <div className="flex items-center justify-between text-base">
                                    <span className="text-neutral-700">BALANCE</span>
                                    <span className="text-black">{balance}</span>
                                </div>
                            </div>
                        )}

                        <ActionButton
                            size="lg"
                            className="h-13 rounded-xl"
                            onClick={handleConfirm}
                            disabled={!selectedPack || isWorking}
                        >
                            {isWorking ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                    {offerActive ? "Claiming..." : "Starting checkout..."}
                                </>
                            ) : (
                                ctaLabel
                            )}
                        </ActionButton>
                    </>
                )}

                {step === "checkout" && clientSecret && (
                    <>
                        <DialogTitle className={titleClass}>Complete payment</DialogTitle>
                        <div className="max-h-[70vh] overflow-y-auto">
                            <EmbeddedCheckoutProvider
                                stripe={getStripe()}
                                options={{ clientSecret, onComplete: () => setStep("confirming") }}
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

                {step === "success" && (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <img src={successAnimation} alt="" className="h-28 w-28" />
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-xl">
                                {claimedFree ? "Credit claimed!" : "Payment successful!"}
                            </DialogTitle>
                            <DialogDescription>
                                {purchasedPack
                                    ? `${purchasedPack.name} pack ${claimedFree ? "claimed" : "purchased"} — ${pluralise(purchasedPack.credits, "credit")} added to your account.`
                                    : "Your credits have been added to your account."}
                            </DialogDescription>
                        </div>

                        <div className="flex w-full flex-col gap-3 rounded-xl bg-neutral-50 p-4 text-left text-sm">
                            {purchasedPack && !claimedFree && (
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-500">Amount charged</span>
                                    <span className="font-medium text-neutral-950">{formatPrice(purchasedPack.pricePence)}</span>
                                </div>
                            )}
                            {unlockResult && unlockResult.creditsUsed > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-500">
                                        Contact{unlockResult.creditsUsed === 1 ? "" : "s"} unlocked
                                    </span>
                                    <span className="font-medium text-neutral-950">{unlockResult.creditsUsed}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">New balance</span>
                                <span className="font-medium text-neutral-950">
                                    {pluralise(unlockResult?.balance ?? balance, "credit")}
                                </span>
                            </div>
                        </div>

                        <p className="flex items-center gap-1.5 text-xs text-neutral-400">
                            <Sparkles className="size-3.5" aria-hidden="true" />
                            Credits never expire — use them whenever you&apos;re ready.
                        </p>

                        <ActionButton size="lg" className="h-13 rounded-xl" onClick={() => onOpenChange(false)}>
                            Done
                        </ActionButton>
                    </div>
                )}

                {step === "error" && (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <XCircle className="size-10 text-error-500" aria-hidden="true" />
                        <DialogTitle>Something went wrong</DialogTitle>
                        <DialogDescription>{errorMessage}</DialogDescription>
                        <ActionButton size="lg" className="h-13 rounded-xl" onClick={handleRetry}>
                            Try again
                        </ActionButton>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreditPurchaseModal;