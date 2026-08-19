import { useNavigate, useOutletContext } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { ArrowRight, Sparkles } from "lucide-react";
import TagInput from "@/components/ui/tagInput";
import JobPostingStepIndicator from "../components/JobPostingStepIndicator";
import type { JobPostingFormValues } from "../schemas/jobPosting";

