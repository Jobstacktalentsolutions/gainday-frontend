import type { SimulationTask, InterfacePayload } from "@/features/simulation-tasks/types";
import { InterfaceType } from "@/features/simulation-tasks/types";
import type { JobBoardListing } from "../types/jobBoard";

export interface JobSimulation {
  id: string;
  jobId: string;
  tasks: SimulationTask[];
  timeLimitMinutes: number;
}

interface TaskTemplate {
  title: string;
  taskType: "objective" | "open_ended";
  category: string;
  interfaceType: InterfaceType;
  objectiveComponent?: Record<string, unknown>;
  openEndedComponent?: Record<string, unknown>;
}

// TODO: delete once GET /jobs/:id/simulation exists. Placeholder scenario/prompt
// content only — the simulation runner isn't built yet, so nothing here is
// actually graded or rendered. questionBankId is null throughout since these
// were never persisted as real question-bank rows.
const TASK_TEMPLATES: Record<string, TaskTemplate[]> = {
  Finance: [
    {
      title: "Reconcile a discrepancy in the monthly close",
      taskType: "objective",
      category: "Reconciliation",
      interfaceType: InterfaceType.TEXT_AREA,
      objectiveComponent: { correctValue: 12450, tolerance: 5, unit: "USD" },
    },
    {
      title: "Respond to a stakeholder pushing back on a budget variance",
      taskType: "open_ended",
      category: "Stakeholder Communication",
      interfaceType: InterfaceType.RICH_TEXT_COMPOSER,
      openEndedComponent: { pushbackStatement: "This variance makes no sense — explain it or we're escalating." },
    },
    {
      title: "Prioritize three competing finance requests under a deadline",
      taskType: "objective",
      category: "Prioritization",
      interfaceType: InterfaceType.TEXT_AREA,
      objectiveComponent: { options: ["Payroll exception", "Vendor dispute", "Board deck numbers"], correctOptionIndex: 2 },
    },
  ],
  Technology: [
    {
      title: "Triage a production incident with limited information",
      taskType: "objective",
      category: "Incident Triage",
      interfaceType: InterfaceType.TEXT_AREA,
      objectiveComponent: { options: ["Roll back deploy", "Scale up replicas", "Page on-call lead"], correctOptionIndex: 0 },
    },
    {
      title: "Explain a technical trade-off to a non-technical stakeholder",
      taskType: "open_ended",
      category: "Technical Communication",
      interfaceType: InterfaceType.RICH_TEXT_COMPOSER,
      openEndedComponent: { dataToInterpret: "Latency p95 rose 40% after the migration; error budget is 60% consumed." },
    },
    {
      title: "Decide which of two fixes to ship before a deadline",
      taskType: "objective",
      category: "Decision Making",
      interfaceType: InterfaceType.TEXT_AREA,
      objectiveComponent: { options: ["Quick patch, known risk", "Full fix, misses deadline"], correctOptionIndex: 0 },
    },
  ],
  Marketing: [
    {
      title: "Diagnose why a campaign underperformed its target",
      taskType: "objective",
      category: "Performance Diagnosis",
      interfaceType: InterfaceType.TABLE_VIEW_RESPONSE_PANEL,
      objectiveComponent: {
        items: ["CTR", "CPC", "Conversion rate"],
        buckets: ["On target", "Below target"],
        correctMapping: [
          { item: "CTR", bucket: "On target" },
          { item: "Conversion rate", bucket: "Below target" },
        ],
      },
    },
    {
      title: "Draft copy responding to a client's brand concern",
      taskType: "open_ended",
      category: "Drafted Communication",
      interfaceType: InterfaceType.RICH_TEXT_COMPOSER,
      openEndedComponent: { recipient: "Client marketing director", goal: "Reassure without over-promising a fix timeline" },
    },
    {
      title: "Allocate a limited budget across three channels",
      taskType: "objective",
      category: "Resource Allocation",
      interfaceType: InterfaceType.TEXT_AREA,
      objectiveComponent: { options: ["Paid search", "Paid social", "Email"], selectCount: 2, correctOptionIndices: [0, 2] },
    },
  ],
  Healthcare: [
    {
      title: "Spot an inconsistency in a clinical dataset",
      taskType: "objective",
      category: "Data Quality",
      interfaceType: InterfaceType.TABLE_VIEW_RESPONSE_PANEL,
      objectiveComponent: {
        items: ["Patient A dosage log", "Patient B visit dates"],
        buckets: ["Consistent", "Inconsistent"],
        correctMapping: [{ item: "Patient B visit dates", bucket: "Inconsistent" }],
      },
    },
    {
      title: "Summarize a data-quality issue for a non-technical lead",
      taskType: "open_ended",
      category: "Written Summary",
      interfaceType: InterfaceType.RICH_TEXT_COMPOSER,
      openEndedComponent: { dataToInterpret: "12% of records have mismatched visit-date and dosage-log timestamps." },
    },
    {
      title: "Decide how to handle a submission-deadline conflict",
      taskType: "objective",
      category: "Prioritization",
      interfaceType: InterfaceType.TEXT_AREA,
      objectiveComponent: { options: ["Submit incomplete on time", "Request extension"], correctOptionIndex: 1 },
    },
  ],
  "Human Resources": [
    {
      title: "Identify the root cause behind a rise in attrition",
      taskType: "objective",
      category: "Root Cause Analysis",
      interfaceType: InterfaceType.TABLE_VIEW_RESPONSE_PANEL,
      objectiveComponent: {
        items: ["Compensation", "Manager quality", "Remote flexibility"],
        buckets: ["Primary driver", "Minor factor"],
        correctMapping: [{ item: "Manager quality", bucket: "Primary driver" }],
      },
    },
    {
      title: "Write a message addressing a sensitive team concern",
      taskType: "open_ended",
      category: "Drafted Communication",
      interfaceType: InterfaceType.RICH_TEXT_COMPOSER,
      openEndedComponent: { recipient: "Engineering team", goal: "Address morale concerns without overcommitting" },
    },
    {
      title: "Decide how to prioritize two competing people issues",
      taskType: "objective",
      category: "Prioritization",
      interfaceType: InterfaceType.TEXT_AREA,
      objectiveComponent: { options: ["Harassment complaint", "Compensation review"], correctOptionIndex: 0 },
    },
  ],
  Sales: [
    {
      title: "Diagnose a stalled deal in the pipeline",
      taskType: "objective",
      category: "Pipeline Diagnosis",
      interfaceType: InterfaceType.TEXT_AREA,
      objectiveComponent: { options: ["Budget freeze", "Champion left company", "Pricing objection"], correctOptionIndex: 1 },
    },
    {
      title: "Respond to a prospect's pricing objection in writing",
      taskType: "open_ended",
      category: "Stakeholder Communication",
      interfaceType: InterfaceType.RICH_TEXT_COMPOSER,
      openEndedComponent: { pushbackStatement: "Your competitor is 20% cheaper — why should we pay more?" },
    },
    {
      title: "Prioritize which of three accounts to focus on this week",
      taskType: "objective",
      category: "Prioritization",
      interfaceType: InterfaceType.TEXT_AREA,
      objectiveComponent: { options: ["Account A", "Account B", "Account C"], correctOptionIndex: 2 },
    },
  ],
};

function buildPayload(interfaceType: InterfaceType): InterfacePayload {
  switch (interfaceType) {
    case InterfaceType.TABLE_VIEW_RESPONSE_PANEL:
      return { interfaceType, table: { columns: [], rows: [] }, placeholder: null };
    case InterfaceType.RICH_TEXT_COMPOSER:
    case InterfaceType.TEXT_AREA:
    default:
      return { interfaceType, placeholder: null };
  }
}

export function getMockSimulation(job: JobBoardListing): JobSimulation {
  const templates = TASK_TEMPLATES[job.roleCategory] ?? TASK_TEMPLATES.Finance;

  const tasks: SimulationTask[] = templates.map((template, index) => ({
    id: `${job.id}-task-${index + 1}`,
    questionBankId: null,
    taskType: template.taskType,
    category: template.category,
    title: template.title,
    scenarioDescription: `Placeholder scenario for "${job.title}" — ${template.title}.`,
    questionPrompt: "Placeholder prompt — full simulation content isn't built yet.",
    objectiveComponent: template.objectiveComponent as Record<string, unknown> | undefined,
    openEndedComponent: template.openEndedComponent as Record<string, unknown> | undefined,
    businessProblemDerived: true,
    interfaceType: template.interfaceType,
    interfacePayload: buildPayload(template.interfaceType) as unknown as Record<string, unknown>,
  }));

  return { id: `sim-${job.id}`, jobId: job.id, tasks, timeLimitMinutes: 20 };
}