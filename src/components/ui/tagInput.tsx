import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
    value : string[];
    onChange : (tags : string[]) => void;
    placeholder? : string;
    className?: string;
}