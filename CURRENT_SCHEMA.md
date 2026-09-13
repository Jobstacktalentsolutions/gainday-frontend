# Backend Schema Reference

Concise reference for entities returned by the API. Sensitive/internal-only fields (password hashes, verification/reset tokens, embeddings) are omitted.

## Users are split by role

There is no single flat "user" object with optional role-specific fields. Instead:

- **`users`** holds only shared auth/identity data (email, role, auth provider, verification/active status) for all three roles.
- Each role has its own **profile table** — `employer_profiles`, `job_seeker_profiles`, `admin_profiles` — holding the fields specific to that role, 1:1 linked to a `users` row.
- Other entities (jobs, submissions, review items) reference the **profile id**, not the `users` id.
- The API composes `users` + the matching profile server-side before returning a "current user" object, so `GET /users/profile` and the login/signup responses return a merged shape like:

```ts
{
  id: string;        // users.id (auth identity)
  email: string;
  role: 'EMPLOYER' | 'JOB_SEEKER' | 'ADMIN';
  profileId: string;  // the role-specific profile's id — use this for ownership/FK comparisons
  fullName: string;
  companyName?: string; // employer only
}
```

The JWT payload also carries `profileId` alongside `sub` (users.id), `email`, and `role`.

## Employer Profile

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | referenced by `jobs.employerId` |
| `userId` | uuid | FK → `users.id`, unique (1:1) |
| `fullName` | string | |
| `companyName` | string \| null | |
| `phoneNumber` | string \| null | |
| `createdAt` / `updatedAt` | timestamp | |

## Job Seeker Profile

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | referenced by `submissions.candidateId` |
| `userId` | uuid | FK → `users.id`, unique (1:1) |
| `fullName` | string | |
| `phoneNumber` | string \| null | |
| `capabilityScores` | object \| null | per-domain score history, see below |
| `createdAt` / `updatedAt` | timestamp | |

**`capabilityScores`** — keyed by domain (e.g. role category):
```ts
{
  [domain: string]: {
    score: number;
    updatedAt: string;
    categories: {
      problemSolving: number;
      judgmentExecution: number;
      writtenCommunication: number;
      commercialDomainAwareness: number;
    };
  };
}
```

## Admin Profile

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | referenced by `generationReviewItems.reviewedByAdminId` |
| `userId` | uuid | FK → `users.id`, unique (1:1) |
| `fullName` | string | |
| `createdAt` / `updatedAt` | timestamp | |

## Job

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `title` | string | |
| `description` | string | |
| `requiredSkills` | string[] | |
| `roleCategory` | string | |
| `location` | string | |
| `employmentType` | string | |
| `salaryRange` | `{ min, max, currency }` | |
| `applicationDeadline` | timestamp | |
| `businessProblem` | string | |
| `status` | `DRAFT` \| `GENERATING` \| `ACTIVE` \| `UNDER_REVIEW` \| `SHORTLIST_READY` \| `CLOSED` \| `GENERATION_FAILED` | |
| `employerId` | uuid | FK → **Employer Profile** (`employer_profiles.id`), not `users.id` |
| `createdAt` / `updatedAt` | timestamp | |

## Simulation

One per job — the set of tasks a candidate completes.

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `jobId` | uuid | FK → Job, unique |
| `tasks` | `SimulationTask[]` | |
| `timeLimitMinutes` | integer | default 30 |

**`SimulationTask`**:
```ts
{
  id: string;
  taskType: string;
  category: string;
  title: string;
  scenarioDescription: string;   // markdown
  questionPrompt: string;        // markdown
  objectiveComponent?: Record<string, unknown>;
  openEndedComponent?: Record<string, unknown>;
  businessProblemDerived: boolean;
  interfaceType: string;         // tells the frontend which component/layout to render
  interfacePayload: Record<string, unknown>; // shape depends on interfaceType
}
```

> `scenarioDescription` / `questionPrompt` are GitHub-flavored Markdown. Render with a Markdown renderer that does **not** interpret raw HTML (e.g. `react-markdown` without `rehype-raw`).

## Submission

A candidate's attempt at a job's simulation.

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `jobId` | uuid | FK → Job |
| `simulationId` | uuid | FK → Simulation |
| `candidateId` | uuid \| null | FK → **Job Seeker Profile** (`job_seeker_profiles.id`), not `users.id`; null for guest |
| `guestInfo` | `{ fullName, email, phoneNumber? }` \| null | present when no `candidateId` |
| `status` | `PENDING` \| `SCORING` \| `SCORED` \| `DISQUALIFIED` | |
| `answers` | `CandidateAnswer[]` | `{ taskId, responseBody, timeSpentSeconds }` |
| `overallScore` | number \| null | |
| `categoryScores` | `CategoryScores` \| null | see below |
| `timeTakenSeconds` | integer \| null | |
| `isAntiCheatFlagged` | boolean | |
| `antiCheatFlags` | string[] \| null | |
| `disqualificationReason` | string \| null | |
| `startedAt` / `completedAt` | timestamp \| null | |
| `isUnlocked` | boolean | gates employer visibility of full results |

**`CategoryScores`** — each of the four categories has `{ score, rationale, evidence }`:
```ts
{
  problemSolving: { score, rationale, evidence };
  judgmentExecution: { score, rationale, evidence };
  writtenCommunication: { score, rationale, evidence };
  commercialDomainAwareness: { score, rationale, evidence };
}
```

## Question Bank Entry

Reusable task templates (admin/generation-facing; not typically consumed directly by candidate/employer UI, but shapes `SimulationTask`).

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `category` / `subCategory` | string | |
| `intent` | string | |
| `taskType` | string | |
| `taskContent` | `QuestionBankTaskContent` | same shape as `SimulationTask` minus `id`/`category` |
| `sourceJobId` | uuid \| null | FK → Job |


### Relationships

- `User` → has one profile of exactly one kind, based on `role`: `Employer Profile`, `Job Seeker Profile`, or `Admin Profile`
- `Employer Profile` → has many `Job`
- `Job` → has one `Simulation`, has many `Submission`
- `Simulation` → belongs to `Job`, has many `Submission`
- `Submission` → belongs to `Job`, `Simulation`, optionally `Job Seeker Profile` (candidate)
