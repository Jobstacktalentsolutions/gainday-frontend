import { Trash2 } from "lucide-react";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import TaskTypeBadge from "./TaskTypeBadge";
import type { SimulationTask } from "../schemas/jobPosting";


interface TaskCardProps {
  index: number;
  task: SimulationTask;
  onRemove: () => void;
  onChange: (field: "title" | "prompt" | "scenario", value: string) => void;
  errors?: {
    title?: string;
    prompt?: string;
    scenario?: string;
  };
}