import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import EmployerNavDrawer from "./EmployerNavDrawer";
import BrandLogo from "@/assets/gainday icon.svg";


const EmployerTopNav = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <header className="fixed left-0 top-0 z-40 flex w-full items-center justify-between border-b-[0.5px] border-neutral-300 bg-white/10 px-6 py-3.5 backdrop-blur-[100px]">
                <span className="">
                    <img
                        src={BrandLogo}
                        alt="Brand logo"
                        className=""
                    />
                </span>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        aria-label="Open menu"
                        className="flex size-6 items-center justify-center"
                    >
                        <Menu className="size-6 text-neutral-950" aria-hidden="true" />
                    </button>
                    {/* <button
                        type="button"
                        aria-label="Notifications"
                        className="flex size-6 items-center justify-center rounded-full bg-primary-50"
                    >
                        <Bell className="size-3 text-primary-500" aria-hidden="true" />
                    </button> */}
                </div>
            </header>
            <EmployerNavDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
        </>
    );
}

export default EmployerTopNav;