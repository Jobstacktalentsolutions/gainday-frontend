// src/components/DevRouteLinks.tsx
// TEMPORARY dev-only component — remove before shipping.
import { Link } from "react-router-dom";

const routeGroups = [
  {
    label: "General",
    routes: [{ path: "/landing", label: "Landing Page" }],
  },
  {
    label: "Admin",
    routes: [
      { path: "/admin/login", label: "Admin Login" },
      { path: "/admin/dashboard", label: "Admin Dashboard" },
    ],
  },
  {
    label: "Employer",
    routes: [
      { path: "/employer/signup", label: "Employer Sign Up" },
      { path: "/employer/signin", label: "Employer Sign In" },
      { path: "/employer/forgot-password", label: "Employer Forgot Password" },
      { path: "/employer/reset-password", label: "Employer Reset Password" },
      { path: "/employer/jobs", label: "Employer Jobs" },
    ],
  },
];

const DevRouteLinks = () => {
  return (
    <div className="w-full border-t border-neutral-200 bg-neutral-50 px-6 py-8">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Dev Only — All Routes
      </p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {routeGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 text-sm font-medium text-neutral-700">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.routes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevRouteLinks;