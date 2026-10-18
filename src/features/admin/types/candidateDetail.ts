export interface CategoryScoreDetail {
  score: number;
  rationale: string;
  evidence: string;
}

export interface CandidateCategoryScores {
  problemSolving?: CategoryScoreDetail;
  judgmentExecution?: CategoryScoreDetail;
  writtenCommunication?: CategoryScoreDetail;
  commercialDomainAwareness?: CategoryScoreDetail;
  [key: string]: CategoryScoreDetail | undefined;
}

export interface TaskGradingResult {
  taskId: string;
  questionBankId: string;
  categoryScores: CandidateCategoryScores;
  summary: string;
}

export interface AntiCheatEvent {
  type: string;
  taskId: string | null;
  occurredAt: string;
  durationMs?: number;
}

export interface CandidateSubmission {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  simulationTitle: string;
  status: "PENDING" | "GRADING" | "GRADED" | "GRADING_FAILED" | "DISQUALIFIED" | "WITHDRAWN" | "SELECTED" | "NOT_SELECTED";
  overallScore: number | null;
  categoryScores: CandidateCategoryScores | null;
  taskScores: TaskGradingResult[] | null;
  /** The candidate's raw answers. Only some endpoints send them; the modal skips the section
   *  when absent. */
  answers?: Array<{ taskId: string; responseBody: string; timeSpentSeconds: number }>;
  timeTakenSeconds: number | null;
  isAntiCheatFlagged: boolean;
  antiCheatFlags: AntiCheatEvent[];
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface DomainCapability {
  score: number;
  updatedAt: string;
  categories: {
    problemSolving: number;
    judgmentExecution: number;
    writtenCommunication: number;
    commercialDomainAwareness: number;
  };
}

export interface CapabilityScores {
  [domain: string]: DomainCapability;
}

export interface CandidateDetailResponse {
  id: string;
  email: string;
  role: "JOB_SEEKER" | "CANDIDATE";
  isActive: boolean;
  suspensionReason?: string | null;
  suspendedAt?: string | null;
  createdAt: string;
  name: string;
  status: "active" | "suspended";
  profile: {
    id?: string;
    fullName: string;
    phoneNumber: string | null;
    capabilityScores: CapabilityScores | null;
  };
  stats: {
    totalApplications: number;
    completedSubmissions: number;
    averageScore: number | null;
    antiCheatFlaggedCount: number;
  };
  submissions: CandidateSubmission[];
}
