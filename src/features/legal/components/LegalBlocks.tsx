import { Fragment } from "react";
import type { LegalBlock, LegalSection } from "../content/types";

// split() with one capture group puts the captured tokens at odd indexes.
const TOKEN = /(\*\*[^*]+\*\*|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

export const RichText = ({ text }: { text: string }) => (
    <>
        {text.split(TOKEN).map((part, i) => {
            if (i % 2 === 0) return part;
            if (part.startsWith("**")) {
                return (
                    <strong key={i} className="font-semibold text-neutral-900">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return (
                <a
                    key={i}
                    href={`mailto:${part}`}
                    className="font-medium text-primary-600 underline underline-offset-2 transition-colors hover:text-primary-700"
                >
                    {part}
                </a>
            );
        })}
    </>
);

const LegalBlocks = ({ blocks }: { blocks: LegalBlock[] }) => (
    <div className="flex flex-col gap-4">
        {blocks.map((block, i) => {
            switch (block.type) {
                case "p":
                    return (
                        <p key={i} className="text-base leading-7 text-neutral-700">
                            <RichText text={block.text} />
                        </p>
                    );
                case "ul":
                    return (
                        <ul key={i} className="flex flex-col gap-2.5">
                            {block.items.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-base leading-7 text-neutral-700">
                                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-secondary-500" aria-hidden="true" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    );
                case "kv":
                    return (
                        <dl
                            key={i}
                            className="grid gap-x-8 gap-y-3 rounded-xl border border-neutral-200/80 bg-neutral-50 p-5 sm:grid-cols-[max-content_1fr]"
                        >
                            {block.rows.map(([label, value]) => (
                                <Fragment key={label}>
                                    <dt className="text-sm text-neutral-500">{label}</dt>
                                    <dd className="text-base text-neutral-900">
                                        <RichText text={value} />
                                    </dd>
                                </Fragment>
                            ))}
                        </dl>
                    );
            }
        })}
    </div>
);

export const LegalSectionView = ({ section }: { section: LegalSection }) => (
    <section
        id={section.id}
        aria-labelledby={`${section.id}-title`}
        className="scroll-mt-32 border-t border-neutral-200/70 py-8 first:border-t-0 first:pt-0"
    >
        <div className="flex items-center gap-3">
            <span className="rounded-md bg-primary-50 px-2 py-1 text-xs font-semibold tabular-nums text-primary-600">
                {section.label}
            </span>
            <h2
                id={`${section.id}-title`}
                className="text-xl font-bold tracking-tight text-neutral-900 lg:text-2xl"
            >
                {section.title}
            </h2>
        </div>
        <div className="mt-4">
            <LegalBlocks blocks={section.blocks} />
        </div>
    </section>
);

export default LegalBlocks;