import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Skeleton = ({ className, ...props} : HTMLAttributes<HTMLDivElement>) => {
    <div className = {cn("animate-pulse rounded-lg bg-neutral-50", className)}  aria-hidden="true" {...props} /> 
}

export default Skeleton;