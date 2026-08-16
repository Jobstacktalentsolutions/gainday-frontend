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

const EmployerNavDrawer = ({ open, onOpenChange } : EmployerNavDrawerProps) => {
    return (
        <Dialog.Root open ={ open } onOpenChange={ onOpenChange }>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
                <Dialog.Content
                className = "fixed inset-y-0 right-0 z-50 flex h-full w-70 flex-col gap-8 bg-white px-6 py-6 shadow-xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
                aria-describedby={ undefined }
                >
                    <div>
                        
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default EmployerNavDrawer;