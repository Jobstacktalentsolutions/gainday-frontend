import SidebarNavItem from "./SidebarNavItem";

const navItems = [
    { to : "/admin/dashboard", label : "Dashboard" },
    { to : "/admin/users", label : "User Management"},
    { to : "/admin/moderation", label : "Content Moderation"},
    { to : "/admin/ai-oversight", label : "AI Oversight"},
]

const AdminSidebar = () => {
    return (
        <nav className = "sticky top-0 flex h-screen w-60 shrink-0 flex-col gap-1 overflow-y-auto bg-neutral-900 px-4 py-6 ">
            <p className = "text-base font-semibold text-neutral-100">Gainday Admin</p>
            <div className = "h-5 w-full shrink-0" />
            {navItems.map((item) => (
                <SidebarNavItem key = {item.to} to = {item.to} label = {item.label} />
            ))}
        </nav>
    );
}

export default AdminSidebar;