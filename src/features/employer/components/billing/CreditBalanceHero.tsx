import { ActionButton } from "@/components/ui/ActionButton";

interface CreditBalanceHeroProps {
    balance: number | undefined;
    isLoading: boolean;
    onBuy: () => void;
}

const CreditBalanceHero = ({ balance, isLoading, onBuy }: CreditBalanceHeroProps) => (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center gap-4">
            <p
                aria-live="polite"
                className="bg-linear-to-b from-primary-950 to-secondary-500 bg-clip-text text-4xl leading-none tracking-tight text-transparent sm:text-5xl"
            >
                {isLoading ? "–" : (balance ?? 0)}
            </p>
            <div className="text-sm text-neutral-700">
                <p>Available credits</p>
                <p className="hidden text-neutral-500 sm:block">No expiry</p>
            </div>
        </div>
        <ActionButton gradient={false} variant="primary" size="md" className="w-auto" onClick={onBuy}>
            Buy Credits
        </ActionButton>
    </div>
);

export default CreditBalanceHero;
