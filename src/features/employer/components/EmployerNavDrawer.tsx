import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"


interface EmployerNavDrawerProps {
    open : boolean;
    onOpenChange : ( open : boolean ) => void;
}

const NAV_ITEMS = [
    { to : "/employer/jobs", label : "Your jobs"}
]

const EmployerNavDrawer = ({ open, onOPenChange } : EmployerNavDrawerProps) => {
    return (

    );
}

export default EmployerNavDrawer;