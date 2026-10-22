import { useCreditOverview } from "../hooks/useCredits";
import StatCard from "../components/StatCard";
import SignupBonusForm from "../components/credits/SignupBonusForm";
import SignupCreditFlow from "../components/credits/SignupCreditFlow";
import CreditLedgerTable from "../components/credits/CreditLedgerTable";
import { formatRevenue } from "../utils/money";

const CreditManagement = () => {
  const { data, isLoading, isError } = useCreditOverview();

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-xl bg-neutral-100" />;
  }

  if (isError || !data) {
    return <p className="py-16 text-center text-sm text-error-600">Couldn't load credit settings.</p>;
  }

  const { signupBonus, totals, revenue } = data;
  const collected = formatRevenue(revenue.allTimeGbpPence, revenue.allTimeUsd);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Credits</h1>
        <p className="mt-0.5 text-xs text-neutral-500">
          Set the free credits new employers receive, and track how credits are granted, bought and spent
        </p>
      </div>

      <SignupCreditFlow enabled={signupBonus.enabled} creditAmount={signupBonus.creditAmount} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <SignupBonusForm key={signupBonus.updatedAt ?? "unset"} settings={signupBonus} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <StatCard label="Revenue collected (all time)" value={collected.primary} hint={collected.secondary} />
          </div>
          <StatCard label="Signup bonus recipients" value={totals.signupBonusRecipients} />
          <StatCard label="Credits granted at signup" value={totals.signupBonusCredits} />
          <StatCard label="Credits purchased" value={totals.purchasedCredits} />
          <StatCard label="Credits spent on unlocks" value={totals.creditsSpent} />
          <div className="sm:col-span-2">
            <StatCard label="Outstanding balance across employers" value={totals.outstandingCredits} />
          </div>
        </div>
      </div>

      <CreditLedgerTable />
    </div>
  );
};

export default CreditManagement;
