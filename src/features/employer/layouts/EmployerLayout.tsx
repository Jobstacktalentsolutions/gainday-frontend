import { Outlet } from "react-router-dom";
import EmployerTopNav from "../components/EmployerTopNav";


const EmployerLayout = () => {
    return (
        <div className="min-h-screen bg-neutral-50">
            <EmployerTopNav />
            <Outlet />
        </div>
    );
}

export default EmployerLayout;