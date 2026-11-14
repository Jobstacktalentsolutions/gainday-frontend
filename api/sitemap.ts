// Vercel Function. vercel.json rewrites /sitemap.xml here. Static pages plus every active job
// from the public job board.

interface Req {
    query: Record<string, string | string[] | undefined>;
}
interface Res {
    status(code: number): unknown;
    setHeader(name: string, value: string): unknown;
    send(body: string): unknown;
}

interface BoardItem {
    id: string;
    status?: string;
    updatedAt?: string;
}
interface BoardPage {
    items?: BoardItem[];
    nextOffset?: number | null;
}

const SITE_URL = "https://gainday.org";
const STATIC_PATHS = ["/", "/pricing", "/job-board", "/support"];

const withProtocol = (value: string) => (/^https?:\/\//.test(value) ? value : `https://${value}`);
const API_BASE_URL = withProtocol(
    process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "gainday-backend.up.railway.app",
).replace(/\/+$/, "");

const escapeXml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

async function loadJobs(): Promise<{ jobs: BoardItem[]; complete: boolean }> {
    const jobs: BoardItem[] = [];
    let offset = 0;
    try {
        for (let page = 0; page < 50; page++) {
            const res = await fetch(`${API_BASE_URL}/jobs/board?limit=100&offset=${offset}`, {
                headers: { Accept: "application/json" },
                signal: AbortSignal.timeout(5000),
            });
            if (!res.ok) return { jobs, complete: false };
            const data = (await res.json()) as BoardPage;
            for (const item of data.items ?? []) {
                if (typeof item.id === "string" && (!item.status || item.status === "ACTIVE")) jobs.push(item);
            }
            if (typeof data.nextOffset !== "number") return { jobs, complete: true };
            offset = data.nextOffset;
        }
        return { jobs, complete: false };
    } catch {
        return { jobs, complete: false };
    }
}

export default async function handler(_req: Req, res: Res): Promise<void> {
    const { jobs, complete } = await loadJobs();

    const urls = [
        ...STATIC_PATHS.map((path) => `  <url><loc>${escapeXml(SITE_URL + path)}</loc></url>`),
        ...jobs.map((job) => {
            const lastmod = job.updatedAt && !Number.isNaN(new Date(job.updatedAt).getTime())
                ? `<lastmod>${new Date(job.updatedAt).toISOString()}</lastmod>`
                : "";
            return `  <url><loc>${escapeXml(`${SITE_URL}/job-board/${encodeURIComponent(job.id)}`)}</loc>${lastmod}</url>`;
        }),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

    res.status(200);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    // If the API was down, cache briefly so a partial sitemap doesn't stick around.
    res.setHeader("Cache-Control", complete ? "public, s-maxage=3600, stale-while-revalidate=86400" : "public, s-maxage=60");
    res.send(xml);
}