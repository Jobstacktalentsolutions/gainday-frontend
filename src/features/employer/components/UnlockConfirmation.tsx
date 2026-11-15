import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";
import { useCreditBalance } from "../hooks/useCreditBalance";

export function UnlockConfirmation({ open, onOpenChange, count, onConfirm, onTopUp, pending }: { open: boolean; onOpenChange: (open: boolean) => void; count: number; onConfirm: () => void; onTopUp: () => void; pending: boolean }) {
  const balance = useCreditBalance();
  const credits = balance.data?.balance;
  const insufficient = credits !== undefined && credits < count;
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{insufficient ? "Insufficient credits" : "Unlock candidate details?"}</DialogTitle>
        <DialogDescription>
          {credits === undefined ? (balance.isError ? "Could not load your credit balance. Please try again." : "Checking your credit balance...") : insufficient
            ? `You have ${credits} ${credits === 1 ? "credit" : "credits"}. You need ${count} to unlock ${count === 1 ? "this candidate" : "these candidates"}.`
            : `This will use ${count} ${count === 1 ? "credit" : "credits"} from your balance of ${credits}.`}
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3">
        <ActionButton variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>Cancel</ActionButton>
        {balance.isError ? <ActionButton onClick={() => void balance.refetch()}>Try again</ActionButton> : insufficient
          ? <ActionButton onClick={onTopUp}>Top up credits</ActionButton>
          : <ActionButton onClick={onConfirm} disabled={credits === undefined || pending}>Confirm unlock</ActionButton>}
      </div>
    </DialogContent>
  </Dialog>;
}
