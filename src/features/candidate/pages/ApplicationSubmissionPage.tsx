import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CandidateHeader from "../components/CandidateHeader";

// Placeholder for the candidate's own view of what they submitted. Deliberately separate from
// SubmissionResultPage (the post-simulation score screen) — the real page is still to be built.
const ApplicationSubmissionPage = () => {
    const { applicationId } = useParams<{ applicationId: string }>();

    return (
        <div className="min-h-screen bg-neutral-50">
            <CandidateHeader />
            <main className="px-6 pb-16 pt-32 lg:px-12 lg:pt-44 xl:px-20">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
                    <Link
                        to={`/candidate/applications/${applicationId}`}
                        className="flex w-fit items-center gap-2 text-base text-neutral-700 hover:text-primary-500"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        Back to application
                    </Link>
                    <h1 className="text-3xl text-neutral-900">Hello world submission page</h1>
                </div>
            </main>
        </div>
    );
};

export default ApplicationSubmissionPage;
