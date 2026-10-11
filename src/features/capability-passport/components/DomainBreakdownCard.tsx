import { formatSimulationCount } from "../utils/passport";
import type { PassportDomain } from "../types/passport";

const DomainBreakdownCard = ({ domains }: { domains: PassportDomain[] }) => {
    return (
        <section className="flex w-full flex-col gap-6 rounded-xl bg-white px-6 py-8">
            <h2 className="text-sm uppercase text-primary-500">Domain breakdown</h2>
            {domains.length === 0 ? (
                <p className="text-base text-neutral-500">No domain results yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {domains.map((domain) => (
                        <div
                            key={domain.id}
                            className="flex items-start justify-between gap-3 rounded-2xl border border-primary-200 bg-white/10 p-6"
                        >
                            <div className="flex min-w-0 flex-col gap-2">
                                <p className="text-xl text-neutral-900">{domain.name}</p>
                                <p className="text-base text-neutral-500">{formatSimulationCount(domain.simulationCount)}</p>
                            </div>
                            <p className="shrink-0 text-base text-neutral-700">{domain.score}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default DomainBreakdownCard;