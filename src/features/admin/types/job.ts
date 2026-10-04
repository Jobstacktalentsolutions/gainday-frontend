export type JobStatus = "live" | "draft" | "closed";

export interface SalaryRange {
  min: number | null;
  max: number | null;
  currency: string;
}

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  employerEmail?: string;
  isEmployerVerified?: boolean;
  applicantCount: number;
  scoredApplicantCount?: number;
  averageScore?: number | null;
  flaggedCount?: number;
  status: JobStatus;
  rawStatus?: string;
  createdAt: string;
  isSimulationReady?: boolean;
  simulationTaskCount?: number;
  role?: string;
  skillLevel?: string;
  skillCategory?: string;
  location?: string;
  isRemoteFriendly?: boolean;
  employmentType?: string;
  salaryRange?: SalaryRange | null;
  requiredSkills?: string[];
  applicationDeadline?: string | null;
}

export interface SimulationTask {
  id: string;
  title: string;
  category: string;
  taskType: string;
  scenarioDescription: string;
  questionPrompt: string;
  businessProblemDerived?: boolean;
  interfaceType?: string;
  interfacePayload?: Record<string, unknown>;
}

export interface AdminJobSubmission {
  id: string;
  candidateId: string | null;
  candidateName: string;
  candidateEmail: string;
  overallScore: number | null;
  status: string;
  isAntiCheatFlagged: boolean;
  antiCheatFlags: Array<{
    type: string;
    taskId: string | null;
    occurredAt: string;
    durationMs?: number;
  }>;
  timeTakenSeconds: number | null;
  categoryScores?: Record<string, { score: number; rationale: string; evidence: string }>;
  taskScores?: Array<{
    taskId: string;
    questionBankId: string;
    categoryScores: Record<string, { score: number; rationale: string; evidence: string }>;
    summary: string;
  }>;
  completedAt: string | null;
  createdAt: string;
}

export interface AdminJobDetailResponse {
  id: string;
  title: string;
  description: string | null;
  requiredSkills: string[];
  role: string | null;
  skillLevel: string | null;
  skillCategory: string | null;
  companyDescription: string | null;
  isRemoteFriendly: boolean;
  location: string | null;
  employmentType: string | null;
  salaryRange: SalaryRange | null;
  applicationDeadline: string | null;
  businessProblem: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  employer: {
    id?: string;
    companyName: string;
    fullName?: string;
    email?: string;
    isVerified: boolean;
    phoneNumber?: string | null;
  };
  simulation: {
    id: string;
    timeLimitMinutes: number;
    taskCount: number;
    tasks: SimulationTask[];
  } | null;
  stats: {
    totalApplicants: number;
    scoredApplicants: number;
    averageScore: number | null;
    flaggedApplicants: number;
  };
  submissions: AdminJobSubmission[];
}