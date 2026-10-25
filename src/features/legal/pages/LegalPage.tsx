import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Header from "@/features/landing/components/Header";
import { Footer } from "@/features/landing/components/footer/Footer";
import SectionTag from "@/features/landing/components/SectionTag";
import { useScrollToHash } from "@/features/landing/utils/useScrollToHash";
import { fadeUp } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";
import { AtAGlanceCard } from "../components/AtAGlanceCard";
import { LegalSectionView, RichText } from "../components/LegalBlocks";
import { LegalToc, type TocItem } from "../components/LegalToc";
import { LEGAL_COMPANY } from "../content/shared";
import { getLegalDocument, isLegalAudience } from "../content";
import type { LegalAudience, LegalDocument, LegalKind } from "../content/types";
import { useActiveSection } from "../hooks/useActiveSection";

const AUDIENCES: Array<{ value: LegalAudience; label: string }> = [
    { value: "candidate", label: "For candidates" },
    { value: "employer", label: "For employers" },
];

const AudienceTabs = ({ kind, audience }: { kind: LegalKind; audience: LegalAudience }) => (
    <nav
        aria-label="Choose audience"
        className="inline-flex rounded-xl border border-neutral-200 bg-white p-1 shadow-xs"
    >
        {AUDIENCES.map((tab) => {
            const active = tab.value === audience;
            return (
                <Link
                    key={tab.value}
                    to={`/${kind}/${tab.value}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                        "rounded-lg px-4 py-2 text-sm transition-colors sm:px-5",
                        active
                            ? "bg-primary-500 font-medium text-white"
                            : "text-neutral-700 hover:text-primary-500",
                    )}
                >
                    {tab.label}
                </Link>
            );
        })}
    </nav>
);

const MetaChip = ({ children }: { children: string }) => (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
        {children}
    </span>
);

const LegalContent = ({ doc }: { doc: LegalDocument }) => {
    const tocItems: TocItem[] = [
        ...doc.sections.map((s) => ({ id: s.id, label: s.label, title: s.title })),
        ...(doc.closing ? [{ id: doc.closing.id, title: doc.closing.title }] : []),
    ];
    const activeId = useActiveSection(tocItems.map((item) => item.id));

    useEffect(() => {
        const previous = document.title;
        document.title = `${doc.partTitle} | Gainday`;
        return () => {
            document.title = previous;
        };
    }, [doc.partTitle]);

    const other =
        doc.kind === "terms"
            ? { to: `/privacy/${doc.audience}`, label: "Read the Privacy Policy" }
            : { to: `/terms/${doc.audience}`, label: "Read the Terms and Conditions" };

    return (
        <>
            {/* Hero */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10 flex flex-col gap-5">
                <SectionTag label="Legal" />
                <h1 className="text-[32px] leading-9.5 tracking-[-0.32px] text-black lg:text-[48px] lg:leading-14.5 lg:tracking-[-0.48px]">
                    {doc.title}
                </h1>
                <p className="max-w-2xl text-base text-neutral-700">{doc.summary}</p>

                <div className="flex flex-wrap gap-2">
                    <MetaChip>{`Last updated ${LEGAL_COMPANY.lastUpdated}`}</MetaChip>
                    <MetaChip>{`${LEGAL_COMPANY.name} · Company no. ${LEGAL_COMPANY.companyNumber}`}</MetaChip>
                    <MetaChip>{`ICO registration ${LEGAL_COMPANY.ico}`}</MetaChip>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <AudienceTabs kind={doc.kind} audience={doc.audience} />
                    <Link
                        to={other.to}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                    >
                        {other.label}
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>
            </motion.div>

            {/* Body */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
                <LegalToc items={tocItems} activeId={activeId} />

                <div className="flex min-w-0 flex-col gap-6">
                    <AtAGlanceCard />

                    <article className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-10">
                        <header className="mb-8">
                            <p className="text-xs font-semibold uppercase tracking-wide text-secondary-600">
                                {doc.partTitle}
                            </p>
                            {doc.intro && (
                                <p className="mt-3 text-base leading-7 text-neutral-700">{doc.intro}</p>
                            )}
                        </header>

                        {doc.sections.map((section) => (
                            <LegalSectionView key={section.id} section={section} />
                        ))}

                        {doc.closing && (
                            <section
                                id={doc.closing.id}
                                aria-labelledby={`${doc.closing.id}-title`}
                                className="mt-4 scroll-mt-32 rounded-xl border border-secondary-200 bg-secondary-50 p-6"
                            >
                                <h2
                                    id={`${doc.closing.id}-title`}
                                    className="text-lg font-bold tracking-tight text-neutral-900"
                                >
                                    {doc.closing.title}
                                </h2>
                                <p className="mt-2 text-base leading-7 text-neutral-700">
                                    <RichText text={doc.closing.text} />
                                </p>
                            </section>
                        )}
                    </article>
                </div>
            </div>
        </>
    );
};

const LegalPage = ({ kind }: { kind: LegalKind }) => {
    const { audience } = useParams<{ audience: string }>();
    useScrollToHash(); // deep links like /privacy/candidate#a5

    if (!isLegalAudience(audience)) {
        return <Navigate to={`/${kind}/candidate`} replace />;
    }

    const doc = getLegalDocument(kind, audience);

    return (
        <div className="flex min-h-screen flex-col justify-between bg-neutral-50">
            <Header />
            <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-16 pt-32 sm:px-8 sm:pt-38">
                {/* key remounts the content (and scroll-spy) when kind/audience changes */}
                <LegalContent key={`${kind}-${audience}`} doc={doc} />
            </main>
            <Footer />
        </div>
    );
};

export default LegalPage;