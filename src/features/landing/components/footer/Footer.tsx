import { motion } from "motion/react"
import { fadeUp } from "@/lib/motion/variants"
import { FooterColumn, type FooterLinkItem } from "./FooterColumn";
import { useTryChallengePath } from "../../utils/useTryChallengePath";
import { landingSectionPath } from "../../utils/scrollToSection";
import brandLogo from "@/assets/gainday icon.svg";
import { LEGAL_COMPANY } from "@/features/legal/content/shared"


const companyLinks: FooterLinkItem[] = [
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
];

const contactLinks: FooterLinkItem[] = [
    { label: LEGAL_COMPANY.email, href: `mailto:${LEGAL_COMPANY.email}` },
];

// TODO: replace the "#" placeholders with the real profile URLs.
const SocialIcons = () => (
    <div className="flex items-center gap-3 pt-1">
        {[
            { label: "LinkedIn", icon: "/social-icons/linkedin.png" },
            { label: "Facebook", icon: "/social-icons/facebook.png" },
        ].map((social) => (
            <a
                key={social.label}
                href="#"
                aria-label={`Gainday on ${social.label}`}
                onClick={(e) => e.preventDefault()}
                className="transition-transform duration-300 hover:scale-110"
            >
                <img src={social.icon} alt="" className="size-5" />
            </a>
        ))}
    </div>
);

export function Footer() {

    const tryChallengePath = useTryChallengePath()

    const productLinks: FooterLinkItem[] = [
        { label: "How it works", to: landingSectionPath("assessment-process") },
        { label: "Try a challenge", to: tryChallengePath },
        { label: "For candidates", to: landingSectionPath("for-candidates") },
        { label: "For employers", to: landingSectionPath("for-employers") },
    ]

    return (
        <motion.footer
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex w-full flex-col items-center gap-5 px-6 py-10 lg:gap-10 lg:px-30 lg:py-13.75"
        >
            <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col items-start gap-4 lg:gap-6">
                    <img src={brandLogo} alt="Gainday" className="h-[57.6px] w-34" />
                    <p className="w-74.5 text-base leading-6 text-neutral-700">
                        Built for proof, not paper. Show employers what you can actually
                        do — not just what your CV says you&rsquo;ve done.
                    </p>
                </div>

                <div className="flex gap-33.75 lg:contents">
                    <FooterColumn heading="PRODUCT" links={productLinks} />
                    <FooterColumn heading="COMPANY" links={companyLinks} />
                </div>
                <FooterColumn heading="GET IN TOUCH" links={contactLinks} extra={<SocialIcons />} />

            </div>

            <div className="h-px w-full bg-neutral-300" />

            <div className="flex w-full flex-col items-start gap-3 text-xs text-neutral-700 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-0 lg:text-base">
                <p>CAPABILITY BEFORE CREDENTIALS</p>
                <p>© {new Date().getFullYear()} Gainday Ltd. All rights reserved.</p>
            </div>
        </motion.footer>
    )
}