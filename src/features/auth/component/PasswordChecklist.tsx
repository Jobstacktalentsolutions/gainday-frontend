import { Check, X} from "lucide-react";
import { cn } from "@/lib/utils";

interface Rule {
    label : string;
    test : ( value : string) => boolean;
}