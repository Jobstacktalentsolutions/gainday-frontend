import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useDashboardStats } from "../hooks/useDashboardStats";

const AdminDashboard = () => {

    const { data, isLoading, isError } = useDashboardStats();

    return (
        <>
            <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>

            {isLoading && (
                <p className="text-sm text-neutral-500">Loading dashboard...</p>
            )}

            {isError && (
                <p role="alert" className="text-sm text-error-600">
                    Couldn't load dashboard stats. Please try refreshing.
                </p>
            )}

            {data && (
                <>
                    <div className="flex w-full gap-4">
                        <StatCard label="Active Jobs" value={data.stats.activeJobs} />
                        <StatCard label="Active users" value={data.stats.activeUsers} />
                        <StatCard label="Submissions This Week" value={data.stats.submissionsThisWeek} />
                        <StatCard label="Jobs Filled vs Open" value={`${data.stats.jobsFilled} / ${data.stats.activeUsers}`} />
                    </div>

                    <section className="flex w-full flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-5">
                        <h2 className="text-base font-semibold text-neutral-900">
                            Recent Job Posts
                        </h2>
                        {data.recentJobs.map((job) => (
                            <div key = {job.id} className = "flex w-full items-center gap-4 py-2.5">
                                <p className = "flex-1 text-[13px] font-medium text-neutral-900">
                                    {job.title}
                                </p>
                                <StatusBadge status={job.status} />
                            </div>
                        ))}
                    </section>
                </>
            )}
        </>
    );
}

export default AdminDashboard;