import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobPostingSchema, type JobPostingFormValues } from "../schemas/jobPosting";
import { useJobDraftStore } from "../stores/useJobDraftStore";
