import type { LegalDocument } from "./types";
import { LEGAL_COMPANY, companyDetails, p, section, ul } from "./shared";

const EMAIL = LEGAL_COMPANY.email;

export const privacyEmployer: LegalDocument = {
    kind: "privacy",
    audience: "employer",
    title: "Privacy Policy",
    partTitle: "Employer Privacy Notice",
    summary: "How Gainday handles your organisation's information, and what is expected of you when you receive candidate information.",
    sections: [
        section("A1", "Who we are", companyDetails()),
        section(
            "A2",
            "Information we collect",
            ul(
                "Your name, work email and phone number",
                "Job title",
                "Company name and company information",
                "Role and job-description information",
                "Information you provide when creating work simulation assessments",
                "Communications with Gainday",
                "Account activity",
                "Payment information, where payment functionality is introduced",
            ),
        ),
        section(
            "A3",
            "How we use employer information",
            p("We use employer information to:"),
            ul(
                "Create and administer employer accounts",
                "Create roles",
                "Generate and administer work simulation assessments",
                "Provide candidate submissions and assessment results",
                "Operate the platform",
                "Provide customer support",
                "Improve the service",
                "Maintain security",
                "Process payments when applicable",
                "Comply with legal obligations",
            ),
        ),
        section(
            "A4",
            "Candidate information and employer responsibilities",
            p("Gainday processes candidate information during the Gainday assessment process. When Gainday provides identifiable candidate information to an employer for recruitment purposes, the employer is responsible for complying with its own data-protection and employment obligations in relation to that information. Employers must:"),
            ul(
                "Process candidate information lawfully",
                "Keep candidate information secure",
                "Use candidate information only for legitimate recruitment purposes",
                "Respect candidates' data-protection rights",
                "Comply with applicable equality and employment law",
            ),
        ),
        section(
            "A5",
            "AI-assisted assessment",
            p("Gainday may use AI to assist with analysing role requirements, generating work simulation assessments, checking assessment quality, and assessing candidate responses against Gainday's published framework. AI outputs are decision-support information. Employers remain responsible for reviewing the evidence and making their own recruitment decisions. Employers must not treat a Gainday score as an automatic hiring or rejection decision."),
        ),
        section(
            "A6",
            "Candidate CVs",
            p("Candidate CVs may be available to employers where provided as part of the recruitment process. For the Gainday pilot, CV content is not used as an input to AI candidate scoring or ranking. The assessment score is based on the candidate's work simulation assessment responses against the relevant assessment framework."),
        ),
        section(
            "A7",
            "Sharing employer information",
            p("We may share employer information with service providers that help us operate Gainday, including providers supporting hosting, database services, authentication, AI processing, email, security and customer support. We may also disclose information where legally required. We do not sell employer personal data."),
        ),
        section(
            "A8",
            "International transfers",
            p("Some service providers may process information outside the UK. Where required, Gainday will implement appropriate safeguards for international data transfers in accordance with applicable UK data-protection law."),
        ),
        section(
            "A9",
            "Retention",
            p("We retain employer account information for as long as reasonably necessary to operate the account and meet legal and regulatory obligations. Different retention periods may apply to account information, recruitment records, billing records, communications and security records."),
        ),
        section(
            "A10",
            "Your rights",
            p(`You have the right to access, correction, deletion, restriction, objection and portability. Contact ${EMAIL}. You may also complain to the Information Commissioner's Office.`),
        ),
        section(
            "A11",
            "Security",
            p("Gainday uses appropriate technical and organisational measures designed to protect employer and candidate information. Access is controlled according to account permissions."),
        ),
        section(
            "A12",
            "Cookies",
            p("Gainday uses necessary cookies and, where applicable, non-essential cookies subject to the appropriate consent requirements."),
        ),
    ],
};