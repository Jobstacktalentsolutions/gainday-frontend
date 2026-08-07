
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