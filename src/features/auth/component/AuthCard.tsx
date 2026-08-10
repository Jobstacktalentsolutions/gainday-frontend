
import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import brandLogo from "@/assets/gainday.svg"

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AuthCard = ({
    title,
    subtitle,
    children,
    open,
    onOpenChange
}: AuthCardProps) => {

    const isDesktop = useMediaQuery("(min-width: 1024px)")

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className={cn("fixed inset-0 z-50",
                        isDesktop && "bg-primary-200/50 backdrop-blur-[20px]"
                    )}
                />
                <Dialog.Content
                    onOpenAutoFocus={(e) => {
                        if (!isDesktop) e.preventDefault();
                    }}
                    className={cn(
                        "fixed z-50 flex flex-col items-center gap-12 bg-white focus:outline-none lg:gap-15",
                        isDesktop ?
                            "top-1/2 left-1/2 w-141.5 max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-12 shadow-lg"
                            : "inset-0 w-full overflow-y-auto p-6"
                    )}
                >
                    <div className="flex flex-col items-center gap-4 text-center pt-6">
                        <div className="mb-5 lg:hidden">
                            <img
                                src={brandLogo}
                                alt="Brand logo"
                                className=""
                            />
                        </div>
                        <div className="lg:max-w-103 space-y-2">
                            <Dialog.Title className="text-2xl leading-8 tracking-[-0.32px] text-primary-950 lg:text-[32px]">
                                {title}
                            </Dialog.Title>
                            <Dialog.Description className="text-base text-neutral-700 leading-6">
                                {subtitle}
                            </Dialog.Description>
                        </div>

                    </div>
                    <div className="flex w-full flex-col gap-4">{children}</div>

                </Dialog.Content>


            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default AuthCard;