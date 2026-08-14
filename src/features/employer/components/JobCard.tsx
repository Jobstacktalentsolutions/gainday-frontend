import { Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import StatusBadge from "./StatusBadge";
import JobMetaRow from "./JobMetaRow";
import type { Job } from "../types/job";

interface  JobCardProps {
    job : Job;
    onShareLink : (job : Job) => void;
    onViewSubmissions : (job : Job) => void;
}

const formatPostedDate = (postedAt : string | null) => {
    if (!postedAt) return "Not published yet";

    return `Posted ${ new Date(postedAt).toLocaleDateString("en-GB",  {
        day : "numeric",
        month : "short",
        year : "numeric",
    })}`
    
}