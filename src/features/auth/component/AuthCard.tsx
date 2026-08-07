
import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@lib/utils";
import { useMediaQuery } from "@/hooks/usemediaQuery";

interface AuthCardProps {
    title : string;
    subtitle : string;
    children: ReactNode;
    open : boolean;
    onOpenChange : (open : boolean) => void;
}

const AuthCard = ({
    title,
    subtitle,
    children,
    open,
    onOpenChange
} : AuthCardProps) => {

    const isDesktop = useMediaQuery("(min-width: 1024px)")

    return (
        <Dialog.Root open = { open } onOpenChange={ onOpenChange }>
            <Dialog.Portal>
                <Dialog.Overlay
                className = {cn("fixed inset-0 z-50",
                    isDesktop && "bg-primary-200/50 backdrop-blur-[20px]"
                )}
                />

                
            </Dialog.Portal>
        </Dialog.Root>
    )
}