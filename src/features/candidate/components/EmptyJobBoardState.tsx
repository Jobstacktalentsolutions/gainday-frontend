import { Briefcase } from "@/components/ui/icons";
import { useNavigate } from "react-router-dom";
import AddItemButton from "@/components/ui/AddItemButton";


export function EmptyJobBoardState() {
    const navigate = useNavigate();
    return (
        <div className="flex h-103.5 w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-primary-300 bg-white py-7.25">
            <span className="icon-gradient-frame size-15">
                <span className="text-primary-500"><Briefcase className="size-6" /></span>
            </span>
            <div className="flex flex-col items-center gap-6">
                <p className="w-86 text-center text-[16px] text-neutral-700">
                    There are no open roles right now. Check back later.
                </p>
                <AddItemButton onClick={() => navigate("/employer/signup")}>
                    Hiring? Post a Job
                </AddItemButton>
            </div>
        </div>
    );
}
