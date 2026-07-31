import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
    return (
        <div className="flex  items-start bg-neutral-50">
            <AdminSidebar />
            <main className="flex flex-1 flex-col gap-6 px-10 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;