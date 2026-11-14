// Vercel Function. vercel.json rewrites /job-board/:id here. It returns the normal app shell with
// job-specific <head> tags so link previews and crawlers see the real job. Everything dynamic is
// HTML-escaped, and "<" is escaped inside the JSON-LD, because employers write this text.

type Headers = Record<string, string | string[] | undefined>;
interface Req {
    query: Record<string, string | string[] | undefined>;
    headers: Headers;
}
interface Res {
    status(code: number): unknown;
    setHeader(name: string, value: string): unknown;
    send(body: string): unknown;
}

interface ApiJob {
    id: string;
    title: string | null;
    description: string | null;
    location: string | null;
    employmentType: string | null;
    applicationDeadline: string | null;
    status: string;
    employer: { companyName: string | null } | null;
    createdAt: string;
}

type JobResult = { kind: "ok"; job: ApiJob } | { kind: "missing" } | { kind: "error" };

const SITE_URL = "https://gainday.org";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;
const DEFAULT_TITLE = "Gainday | Hire on proof of skill, not CVs";
const DEFAULT_DESCRIPTION =
    "Turn a job description into a work simulation. Candidates apply by doing the job, and you get a ranked shortlist based on how they perform.";

const withProtocol = (value: string) => (/^https?:\/\//.test(value) ? value : `https://${value}`);
const API_BASE_URL = withProtocol(
    process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "gainday-backend.up.railway.app",
).replace(/\/+$/, "");

const EMPLOYMENT_TYPES: Record<string, string> = {
    "full-time": "FULL_TIME",
    "full time": "FULL_TIME",
    "part-time": "PART_TIME",
    "part time": "PART_TIME",
    contract: "CONTRACTOR",
    contractor: "CONTRACTOR",
    internship: "INTERN",
    temporary: "TEMPORARY",
};

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function toPlainText(text: string | null | undefined): string {
    return (text ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/^\s{0,3}(?:#{1,6}|[-*+]|>|\d+\.)\s+/gm, "")
        .replace(/(\*\*|__|\*|`|~~)/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function summarise(text: string | null | undefined, max = 155): string {
    const plain = toPlainText(text).replace(/\s+/g, " ");
    if (plain.length <= max) return plain;
    const cut = plain.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(" ");
    return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).trimEnd()}…`;
}

const toDate = (value: string | null | undefined): Date | null => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
};

async function loadShell(origin: string): Promise<string | null> {
    try {
        const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const res = await fetch(`${origin}/index.html`, {
            headers: bypass ? { "x-vercel-protection-bypass": bypass } : {},
            signal: AbortSignal.timeout(4000),
        });
        return res.ok ? await res.text() : null;
    } catch {
        return null;
    }
}

async function loadJob(id: string): Promise<JobResult> {
    try {
        const res = await fetch(`${API_BASE_URL}/jobs/${encodeURIComponent(id)}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(4000),
        });
        if (res.status === 404) return { kind: "missing" };
        if (!res.ok) return { kind: "error" };
        const data: unknown = await res.json().catch(() => null);
        if (!data || typeof data !== "object" || typeof (data as ApiJob).id !== "string") return { kind: "missing" };
        return { kind: "ok", job: data as ApiJob };
    } catch {
        return { kind: "error" };
    }
}

function buildJobPosting(job: ApiJob, url: string): Record<string, unknown> | null {
    const title = job.title?.trim();
    const company = job.employer?.companyName?.trim();
    const text = toPlainText(job.description);
    const location = (job.location ?? "").trim();
    const posted = toDate(job.createdAt);
    // Google rejects incomplete postings, so emit nothing rather than invalid markup.
    if (!title || !company || !text || !location || !posted) return null;

    const posting: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title,
        description: text
            .slice(0, 5000)
            .split(/\n{2,}/)
            .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
            .join(""),
        datePosted: posted.toISOString().slice(0, 10),
        hiringOrganization: { "@type": "Organization", name: company },
        directApply: true,
        url,
    };

    const deadline = toDate(job.applicationDeadline);
    if (deadline) posting.validThrough = deadline.toISOString();

    const employmentType = EMPLOYMENT_TYPES[(job.employmentType ?? "").trim().toLowerCase()];
    if (employmentType) posting.employmentType = employmentType;

    if (/^remote\b/i.test(location)) {
        posting.jobLocationType = "TELECOMMUTE";
        posting.applicantLocationRequirements = { "@type": "Country", name: "GB" };
    } else {
        posting.jobLocation = {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: location.split(",")[0].trim(), addressCountry: "GB" },
        };
    }
    return posting;
}

interface HeadMeta {
    title: string;
    description: string;
    url: string;
    image: string;
    noindex: boolean;
    jsonLd?: Record<string, unknown> | null;
}

function renderHead(m: HeadMeta): string {
    const t = escapeHtml(m.title);
    const d = escapeHtml(m.description);
    const u = escapeHtml(m.url);
    const i = escapeHtml(m.image);
    const lines = [
        `<title>${t}</title>`,
        `<meta name="description" content="${d}" />`,
        `<link rel="canonical" href="${u}" />`,
        `<meta property="og:site_name" content="Gainday" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${t}" />`,
        `<meta property="og:description" content="${d}" />`,
        `<meta property="og:url" content="${u}" />`,
        `<meta property="og:image" content="${i}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${t}" />`,
        `<meta name="twitter:description" content="${d}" />`,
        `<meta name="twitter:image" content="${i}" />`,
    ];
    if (m.noindex) lines.push(`<meta name="robots" content="noindex, nofollow" />`);
    if (m.jsonLd) {
        lines.push(`<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, "\\u003c")}</script>`);
    }
    return lines.join("\n");
}

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;

function inject(shell: string, head: string): string {
    const block = `<!--seo:start-->\n${head}\n<!--seo:end-->`;
    // Function replacers: job text can contain "$&" or "$1", which a plain string would interpret.
    return SEO_BLOCK.test(shell) ? shell.replace(SEO_BLOCK, () => block) : shell.replace("</head>", () => `${block}\n</head>`);
}

export default async function handler(req: Req, res: Res): Promise<void> {
    const rawId = first(req.query.id);
    const id = rawId && /^[A-Za-z0-9_-]{1,64}$/.test(rawId) ? rawId : null;
    const host = first(req.headers.host);
    const origin = host ? `https://${host}` : SITE_URL; // only used to fetch the shell, never echoed into the page

    const [shell, result] = await Promise.all([
        loadShell(origin),
        id ? loadJob(id) : Promise.resolve<JobResult>({ kind: "missing" }),
    ]);

    if (shell === null) {
        res.status(502);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.send("Temporarily unavailable");
        return;
    }

    const url = id ? `${SITE_URL}/job-board/${encodeURIComponent(id)}` : `${SITE_URL}/job-board`;
    const generic: HeadMeta = { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, url, image: DEFAULT_IMAGE, noindex: true };

    let status = 200;
    let cache = "public, s-maxage=60, stale-while-revalidate=300";
    let meta: HeadMeta = generic;

    if (result.kind === "missing") {
        status = 404;
        cache = "public, s-maxage=60";
        meta = { ...generic, title: "Job not found | Gainday" };
    } else if (result.kind === "error") {
        cache = "no-store";
        meta = { ...generic, noindex: false }; // transient API failure: don't tell crawlers to drop the page
    } else {
        const job = result.job;
        const deadline = toDate(job.applicationDeadline);
        const expired = deadline ? deadline.getTime() < Date.now() : false;
        const title = job.title?.trim();
        if (job.status === "ACTIVE" && !expired && title) {
            const company = job.employer?.companyName?.trim();
            meta = {
                title: `${title}${company ? ` at ${company}` : ""} | Gainday`,
                description: summarise(job.description) || "Apply to this role by completing a short work simulation on Gainday.",
                url,
                image: DEFAULT_IMAGE,
                noindex: false,
                jsonLd: buildJobPosting(job, url),
            };
        }
        // Draft, closed or expired jobs get the generic noindex head: no details leak into previews.
    }

    res.status(status);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", cache);
    if (meta.noindex) res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.send(inject(shell, renderHead(meta)));
}