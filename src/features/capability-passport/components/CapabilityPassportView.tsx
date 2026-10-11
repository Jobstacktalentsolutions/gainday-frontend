import CompositeScoreCard from "./CompositeScoreCard";
import CapabilityDimensionsCard from "./CapabilityDimensionsCard";
import DomainBreakdownCard from "./DomainBreakdownCard";
import WhatStoodOutCard from "./WhatStoodOutCard";
import ImprovementSuggestionsCard from "./ImprovementSuggestionsCard";
import type { CapabilityPassportSummary, ImprovementSuggestion } from "../types/passport";

interface CapabilityPassportViewProps {
    passport: CapabilityPassportSummary & { improvementSuggestions?: ImprovementSuggestion[] };
    variant: "candidate" | "employer";
}

const CapabilityPassportView = ({ passport, variant }: CapabilityPassportViewProps) => {
    const isCandidate = variant === "candidate";

    return (
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <div className="flex w-full shrink-0 flex-col gap-6 lg:w-89.5">
                <CompositeScoreCard
                    compositeScore={passport.compositeScore}
                    compositeDelta={passport.compositeDelta}
                    verifiedSimulationCount={passport.verifiedSimulationCount}
                    lastUpdated={passport.lastUpdated}
                    history={passport.history}
                />
                {!isCandidate && <WhatStoodOutCard text={passport.whatStoodOut} />}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-6">
                <CapabilityDimensionsCard dimensions={passport.dimensions} />
                <DomainBreakdownCard domains={passport.domains} />
                {isCandidate && <WhatStoodOutCard text={passport.whatStoodOut} />}
                {isCandidate && passport.improvementSuggestions && (
                    <ImprovementSuggestionsCard suggestions={passport.improvementSuggestions} />
                )}
            </div>
        </div>
    );
};

export default CapabilityPassportView;