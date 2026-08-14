import { useMemo, useState } from "react";
import EmployerPageHeader from "../components/EmployerPageHeader";
import JobStatusTabs from "../components/JobStatusTabs";
import JobCard, { JobCardSkeleton } from "../components/JobCard";
import JobsEmptyState from "../components/JobsEmptyState";
import { useEmployerJobs } from "../hooks/useEmployerJobs";
import type { Job , JobStatusFilter} from "../types/job";