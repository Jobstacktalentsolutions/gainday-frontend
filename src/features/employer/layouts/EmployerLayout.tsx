import { Outlet } from "react-router-dom";
import EmployerTopNav from "../components/EmployerTopNav";
import ExperienceReviewPrompt from "@/features/reviews/components/ExperienceReviewPrompt";

const EmployerLayout = () => {
    return (
        <div className="min-h-screen bg-neutral-50">
            <EmployerTopNav />
            <Outlet />
            <ExperienceReviewPrompt />
        </div>
    );
}

export default EmployerLayout;