
import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import brandLogo from "@/assets/gainday.svg"
import Header from "@/features/landing/components/Header"

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
        <>
            {isDesktop && <Header />}
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        className={cn("fixed inset-0 z-40",
                            isDesktop
                                ? "overflow-y-auto bg-primary-50/50 backdrop-blur-[20px] flex justify-center items-start pt-50 pb-10"
                                : ""
                        )}
                    />
                    <Dialog.Content
                        onOpenAutoFocus={(e) => {
                            if (!isDesktop) e.preventDefault();
                        }}
                        className={cn(
                            "z-40 flex flex-col items-center focus:outline-none",
                            isDesktop
                                ? "fixed inset-0 overflow-y-auto pt-40 pb-10 bg-transparent"
                                : "fixed inset-0 w-full overflow-y-auto p-6 bg-white gap-12 lg:gap-15"
                        )}
                    >
                        {isDesktop ? (
                            <div className="mx-auto w-141.5 max-w-[92vw] rounded-2xl bg-white p-12 shadow-lg flex flex-col items-center gap-12 lg:gap-15 my-auto">
                                <div className="flex flex-col items-center gap-4 text-center pt-6">
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
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </Dialog.Content>


                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}

export default AuthCard;