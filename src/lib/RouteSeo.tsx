import { useLocation } from "react-router-dom";
import { useSeo, type SeoMeta } from "./seo";

const PUBLIC_PAGES: Record<string, SeoMeta> = {
    "/": { title: "Gainday | Hire on proof of skill, not CVs" },
    "/pricing": {
        title: "Pricing | Gainday",
        description: "Buy credits and unlock the candidates who prove they can do the job. See Gainday's credit packs and pricing.",
    },
    "/job-board": {
        title: "Browse jobs | Gainday",
        description: "Browse live roles and apply by completing a short work simulation instead of writing a cover letter.",
    },
    "/support": {
        title: "Support | Gainday",
        description: "Questions about Gainday? Send us a message and we'll get back to you.",
    },
};

// These pages know their own data and call useSeo themselves.
const SELF_MANAGED = [/^\/job-board\/[^/]+$/, /^\/(terms|privacy)(\/|$)/];

const PRIVATE_AREAS: [RegExp, string][] = [
    [/^\/admin/, "Admin"],
    [/^\/employer/, "Employer"],
    [/^\/candidate/, "Candidate"],
    [/^\/profile/, "Profile"],
];

export function RouteSeo() {
    const { pathname } = useLocation();
    const path = pathname.replace(/\/+$/, "") || "/";

    let meta: SeoMeta | null;
    if (SELF_MANAGED.some((re) => re.test(path))) {
        meta = null;
    } else if (PUBLIC_PAGES[path]) {
        meta = PUBLIC_PAGES[path];
    } else {
        const area = PRIVATE_AREAS.find(([re]) => re.test(path));
        meta = { title: area ? `${area[1]} | Gainday` : "Gainday", noindex: true };
    }

    useSeo(meta);
    return null;
}