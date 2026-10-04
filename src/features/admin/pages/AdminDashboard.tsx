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
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Active Jobs" value={data.stats.activeJobs} />
                        <StatCard label="Total Users" value={data.stats.totalUsers} />
                        <StatCard label="Pending Submissions" value={data.stats.openSubmissions} />
                        <StatCard label="Jobs Filled" value={data.stats.jobsFilled} />
                    </div>

                    <section className="flex w-full flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
                        <h2 className="text-base font-semibold text-neutral-900">
                            Recent Job Posts
                        </h2>
                        {data.recentJobs.length === 0 ? (
                            <p className="py-4 text-sm text-neutral-500">No job posts recorded yet.</p>
                        ) : (
                            data.recentJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="flex w-full items-center gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-50/80 cursor-pointer"
                                >
                                    <p className="flex-1 text-[13px] font-medium text-neutral-900 truncate">
                                        {job.title} — <span className="text-neutral-500 font-normal">{job.company}</span>
                                    </p>
                                    <StatusBadge status={job.status} />
                                </div>
                            ))
                        )}
                    </section>
                </>
            )}
        </>
    );
}

export default AdminDashboard;