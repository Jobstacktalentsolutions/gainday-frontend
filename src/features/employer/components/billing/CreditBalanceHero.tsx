import { ActionButton } from "@/components/ui/ActionButton";

interface CreditBalanceHeroProps {
    balance: number | undefined;
    isLoading: boolean;
    onBuy: () => void;
}

const CreditBalanceHero = ({ balance, isLoading, onBuy }: CreditBalanceHeroProps) => (
    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
            <p
                aria-live="polite"
                className="bg-linear-to-b from-primary-950 to-secondary-500 bg-clip-text text-[72px] leading-16 tracking-[-0.72px] text-transparent sm:text-[96px] sm:leading-20 sm:tracking-[-0.96px]"
            >
                {isLoading ? "–" : (balance ?? 0)}
            </p>
            <p className="text-base uppercase text-primary-500">Available credits · never expire</p>
        </div>
        <ActionButton variant="primary" size="lg" className="h-13 w-auto px-6" onClick={onBuy}>
            Buy Credits
        </ActionButton>
    </div>
);

export default CreditBalanceHero;