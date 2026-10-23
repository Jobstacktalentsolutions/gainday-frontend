import type { LegalDocument } from "./types";
import { LEGAL_COMPANY, p, section, ul } from "./shared";

export const termsCandidate: LegalDocument = {
    kind: "terms",
    audience: "candidate",
    title: "Terms and Conditions",
    partTitle: "Candidate Terms and Conditions",
    summary: "The rules for creating an account, applying for roles and completing work simulation assessments on Gainday.",
    sections: [
        section(
            "B1",
            "Using Gainday",
            p("Gainday enables candidates to apply for roles through work simulation assessments designed around employer requirements. Gainday does not employ candidates, guarantee interviews, guarantee progression, guarantee job offers, or make final hiring decisions. Hiring decisions are made by the relevant employer."),
        ),
        section(
            "B2",
            "Your account",
            p("You agree to:"),
            ul(
                "Provide accurate information",
                "Keep your account credentials secure",
                "Not impersonate another person",
                "Not create fraudulent applications",
                "Notify us if you believe your account has been compromised",
            ),
        ),
        section(
            "B3",
            "Your assessment",
            p("When completing a work simulation assessment you agree that:"),
            ul(
                "Your responses will be your own work",
                "You will not deliberately manipulate the assessment",
                "You will not impersonate another person",
                "You will not use prohibited assistance where the assessment rules prohibit it",
                "You will provide information honestly",
            ),
            p("Gainday may use appropriate integrity controls to identify potential attempts to manipulate an assessment."),
        ),
        section(
            "B4",
            "Fees",
            p("Candidates are not charged to create an account, apply for a role, complete a work simulation assessment, be assessed, or be considered for a role."),
        ),
        section(
            "B5",
            "Capability Passport",
            p("Your assessment results may contribute to your Capability Passport. You may request deletion of your Capability Passport by contacting Gainday."),
        ),
        section(
            "B6",
            "Intellectual property",
            p("The Gainday platform, work simulation assessments, scoring methodology, assessment framework, software and related materials belong to Gainday or its licensors. Your own assessment responses and other materials that you submit remain yours. You grant Gainday the limited rights necessary to process, store, assess and display your submissions for the purposes described in this Privacy Notice and these Terms."),
        ),
        section(
            "B7",
            "Employer decisions",
            p("Gainday does not control employer recruitment decisions. Employers are responsible for complying with applicable employment, equality and recruitment laws when using information provided through Gainday."),
        ),
        section(
            "B8",
            "Suspension or termination",
            p("We may suspend or terminate an account where we reasonably believe the account has been used fraudulently, unlawfully or in breach of these Terms. You may request closure of your account at any time."),
        ),
        section(
            "B9",
            "Liability",
            p("Gainday does not guarantee uninterrupted platform availability, an interview, progression, employment, or a particular assessment result. Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited."),
        ),
        section("B10", "Governing law", p("These Terms are governed by the laws of England and Wales.")),
        section("B11", "Contact", p(`${LEGAL_COMPANY.name}, ${LEGAL_COMPANY.email}`)),
    ],
    closing: {
        id: "acknowledgement",
        title: "Candidate acknowledgement",
        text: "By creating a Gainday account, you confirm that you have read and understood these Terms and the Privacy Notice. Where a separate consent is legally required, Gainday will request that consent separately.",
    },
};