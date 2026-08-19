import { forwardRef, useState, useId, type SelectHTMLAttributes, type ReactNode } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label : string;
    error? : string;
    hint? : string;
    hideLabel? : boolean;
    optional? : boolean;
    placeholder?: string;
    children : ReactNode;
}