import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Users, CheckCircle, Plus, FileText, ArrowRight } from "lucide-react";
import { useEmployerJobs } from "../hooks/useEmployerJobs";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useProtectedRoute } from "@/features/auth/hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const { data: jobs, isLoading } = useEmployerJobs();
    const { user } = useCurrentUser();
    useProtectedRoute();

    // Calculate stats from jobs data
    const stats = useMemo(() => {
        if (!jobs) return { active: 0, drafts: 0, completed: 0, totalSubmissions: 0 };
        return jobs.reduce(
            (acc, job) => {
                if (job.status === "active") acc.active += 1;
                if (job.status === "draft") acc.drafts += 1;
                if (job.status === "closed") acc.completed += 1;
                acc.totalSubmissions += job.submissionsCount || 0;
                return acc;
            },
            { active: 0, drafts: 0, completed: 0, totalSubmissions: 0 }
        );
    }, [jobs]);

    const activeJobsList = useMemo(() => {
        if (!jobs) return [];
        return jobs.filter((job) => job.status === "active" || job.status === "shortlist_ready" || job.status === "under_review").slice(0, 3);
    }, [jobs]);

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-10 pt-32">
            <div className="mx-auto flex w-full max-w-85.5 flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl text-black">Welcome back, {user?.fullName || "Guest"}</h1>
                        <p className="text-neutral-500 mt-1">Here is what's happening with your job postings today.</p>
                    </div>
                    <Button 
                        onClick={() => navigate("/employer/jobs/new/details")}
                        className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2 self-start sm:self-auto"
                    >
                        <Plus className="size-4" />
                        Post a Job
                    </Button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-primary-50 rounded-lg text-primary-500">
                            <Briefcase className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 font-medium">Active Jobs</p>
                            <h3 className="text-2xl font-semibold text-black mt-1">
                                {isLoading ? "..." : stats.active}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-secondary-50 rounded-lg text-secondary-500">
                            <Users className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 font-medium">Total Submissions</p>
                            <h3 className="text-2xl font-semibold text-black mt-1">
                                {isLoading ? "..." : stats.totalSubmissions}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-500">
                            <CheckCircle className="size-6" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 font-medium">Closed Roles</p>
                            <h3 className="text-2xl font-semibold text-black mt-1">
                                {isLoading ? "..." : stats.completed}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Dashboard Main Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Active Postings Column */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm lg:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <h2 className="text-lg font-medium text-black">Active Postings</h2>
                            <Link to="/employer/jobs" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
                                View all <ArrowRight className="size-3" />
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col gap-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-16 bg-neutral-100 animate-pulse rounded-lg" />
                                ))}
                            </div>
                        ) : activeJobsList.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {activeJobsList.map((job) => (
                                    <div key={job.id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <div>
                                            <h4 className="font-medium text-black text-sm">{job.title}</h4>
                                            <p className="text-xs text-neutral-400 mt-0.5">{job.location} · {job.employmentType}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-black">{job.submissionsCount}</span>
                                                <p className="text-[10px] text-neutral-400 uppercase">Submissions</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                                                job.status === "active" ? "bg-green-50 text-green-700" :
                                                job.status === "shortlist_ready" ? "bg-primary-50 text-primary-700" :
                                                "bg-amber-50 text-amber-700"
                                            }`}>
                                                {job.status.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-500 gap-2">
                                <p>You have no active job postings.</p>
                                <Button 
                                    variant="outline" 
                                    onClick={() => navigate("/employer/jobs/new/details")}
                                    className="mt-2 text-xs"
                                >
                                    Create one now
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions & Tips Column */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-4">
                            <h2 className="text-lg font-medium text-black border-b border-neutral-100 pb-3">Quick Actions</h2>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => navigate("/employer/jobs/new/details")}
                                    className="flex items-center gap-3 p-3 text-left rounded-lg hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100 group"
                                >
                                    <div className="p-2 bg-primary-50 rounded-lg text-primary-500 group-hover:bg-primary-100">
                                        <Plus className="size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-black">Post a Job</h4>
                                        <p className="text-xs text-neutral-400 mt-0.5">Generate a new work simulation</p>
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={() => navigate("/employer/jobs")}
                                    className="flex items-center gap-3 p-3 text-left rounded-lg hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100 group"
                                >
                                    <div className="p-2 bg-secondary-50 rounded-lg text-secondary-500 group-hover:bg-secondary-100">
                                        <FileText className="size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-black">Manage Jobs</h4>
                                        <p className="text-xs text-neutral-400 mt-0.5">Review drafts and closed roles</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Tip Box */}
                        <div className="bg-primary-950 text-white p-6 rounded-xl border border-primary-900 shadow-sm flex flex-col gap-3">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary-400">Pro Tip</h4>
                            <p className="text-xs text-neutral-300 leading-relaxed">
                                AI-generated simulations are automatically created based on your stated business problem. Be as specific as possible in Step 1 to get highly tailored tasks!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
