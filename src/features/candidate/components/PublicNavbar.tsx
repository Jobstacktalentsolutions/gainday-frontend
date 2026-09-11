import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import brandLogo from "@/assets/gainday icon.svg";


export function PublicNavbar() {
  return (
    <header className="fixed left-0 top-0 z-10 flex h-24.5 w-full items-center justify-between border-b-[0.5px] border-neutral-300 bg-white/10 px-6 py-5 backdrop-blur-[100px] sm:px-30">
      <Link to="/" className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-75 active:opacity-50">
        <img src={brandLogo} alt="Gainday logo" className="h-12.75 w-30" />
      </Link>

      <nav className="hidden items-center gap-6 sm:flex">
        <NavLink
          to="/job-board"
          className={({ isActive }) =>
            cn("p-2.5 text-[16px]", isActive ? "text-primary-950" : "text-neutral-700")
          }
        >
          Browse jobs
        </NavLink>
        <NavLink
          to="/for-employers"
          className={({ isActive }) =>
            cn("p-2.5 text-[16px]", isActive ? "text-primary-950" : "text-neutral-700")
          }
        >
          For employers
        </NavLink>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="flex h-13 items-center justify-center rounded-xl border border-primary-500 px-6 py-2 text-[16px] text-primary-500 sm:px-10"
        >
          Log in
        </Link>
        <Link
          to="/signup"
          className="flex h-13 items-center justify-center rounded-xl bg-primary-500 px-6 py-2 text-[16px] text-neutral-50 sm:px-10"
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}