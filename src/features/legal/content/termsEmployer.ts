import type { LegalDocument } from "./types";
import { LEGAL_COMPANY, p, section, ul } from "./shared";

export const termsEmployer: LegalDocument = {
    kind: "terms",
    audience: "employer",
    title: "Terms and Conditions",
    partTitle: "Employer Terms and Conditions",
    summary: "The terms for creating roles, publishing work simulation assessments and reviewing candidates on Gainday.",
    sections: [
        section(
            "B1",
            "Using Gainday",
            p("Gainday provides technology that enables employers to create a role, generate a work simulation assessment, invite candidates, receive candidate submissions, review assessment evidence and scores, and decide which candidates to progress. Gainday does not employ candidates or make final recruitment decisions."),
        ),
        section(
            "B2",
            "Employer account",
            p("You confirm that:"),
            ul(
                "You are authorised to represent the organisation",
                "Information supplied about the organisation and role is accurate",
                "You will keep your account secure",
                "You will use Gainday lawfully",
            ),
        ),
        section(
            "B3",
            "Work simulation assessments",
            p("Gainday may generate assessments using AI-assisted technology based on the role information you provide. You are responsible for reviewing and approving the assessment before it is published. You should ensure that role requirements and assessment criteria are relevant to the position."),
        ),
        section(
            "B4",
            "Candidate assessment and hiring decisions",
            p("Gainday provides assessment evidence and decision support. You agree that:"),
            ul(
                "You will review candidate evidence appropriately",
                "You will not rely solely on an automated score when making recruitment decisions",
                "You remain responsible for the final hiring decision",
                "You will comply with applicable equality and employment law",
                "You will not use Gainday to discriminate unlawfully",
            ),
        ),
        section(
            "B5",
            "Candidate information",
            p("You agree to:"),
            ul(
                "Keep candidate information confidential",
                "Use candidate information only for legitimate recruitment purposes",
                "Protect candidate information against unauthorised access",
                "Comply with applicable data-protection law",
                "Delete or securely dispose of candidate information when it is no longer required",
            ),
        ),
        section(
            "B6",
            "Fees and pilot access",
            p("Gainday's intended commercial model is pay-as-you-go candidate unlock credits, bought as one-off packs with no subscription: Starter £49 (1 credit), Growth £149 (5 credits) and Scale £299 (12 credits). One credit unlocks one candidate profile and credits do not expire. However, Gainday may operate selected pilots free of charge. For the current pilot, no payment is required and no payment card details are collected through Gainday. Gainday may introduce paid functionality in the future and will provide appropriate information before charging users."),
        ),
        section(
            "B7",
            "Candidate contact details",
            p("Candidate contact information should only be accessed where permitted through the Gainday recruitment workflow. Employers must not attempt to circumvent Gainday's controls to obtain or use candidate information for unrelated purposes."),
        ),
        section(
            "B8",
            "Intellectual property",
            p("Gainday owns its platform, work simulation assessment technology, assessment framework, scoring methodology, software, Capability Passport technology and related intellectual property. Employers retain ownership of job descriptions and other materials they provide to Gainday, subject to the rights necessary for Gainday to operate the service. Employers must not copy Gainday's technology, reverse engineer the platform, resell Gainday's technology, or reproduce Gainday's proprietary assessment methodology without permission."),
        ),
        section(
            "B9",
            "Confidentiality",
            p("Both parties agree to take reasonable steps to protect confidential information received from the other."),
        ),
        section(
            "B10",
            "Platform availability",
            p("Gainday is an early-stage technology platform and may be updated, modified or temporarily unavailable. We do not guarantee that every candidate identified will be suitable, that every candidate will complete an assessment, that a particular number of candidates will apply, or that an employer will make a successful hire."),
        ),
        section(
            "B11",
            "Liability",
            p("Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited. Subject to applicable law, Gainday's liability will be limited to losses reasonably foreseeable from its provision of the platform. Gainday is not responsible for an employer's independent recruitment or employment decisions."),
        ),
        section(
            "B12",
            "Termination",
            p("Either party may terminate the employer's use of Gainday. Following termination, Gainday may retain information where required for legal, security, accounting or dispute-resolution purposes."),
        ),
        section("B13", "Governing law", p("These Terms are governed by the laws of England and Wales.")),
        section("B14", "Contact", p(`${LEGAL_COMPANY.name}, ${LEGAL_COMPANY.email}`)),
    ],
};