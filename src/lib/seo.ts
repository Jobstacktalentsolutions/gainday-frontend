import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SITE_URL = "https://gainday.org";
const SITE_NAME = "Gainday";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;
export const DEFAULT_DESCRIPTION =
    "Turn a job description into a work simulation. Candidates apply by doing the job, and you get a ranked shortlist based on how they perform.";

export interface SeoMeta {
    title: string;
    description?: string;
    /** Path for the canonical URL. Defaults to the current pathname. */
    path?: string;
    noindex?: boolean;
    image?: string;
}

function upsertMeta(attr: "name" | "property", key: string, content: string): void {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function removeMeta(attr: "name" | "property", key: string): void {
    document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertCanonical(href: string): void {
    let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!el) {
        el = document.createElement("link");
        el.rel = "canonical";
        document.head.appendChild(el);
    }
    el.href = href;
}

export function canonicalUrl(path: string): string {
    const clean = path.split(/[?#]/)[0].replace(/\/+$/, "");
    return `${SITE_URL}${clean || "/"}`;
}

/** Plain-text summary for meta descriptions: strips markdown/HTML and trims at a word boundary. */
export function summarise(text: string | null | undefined, max = 155): string {
    const plain = (text ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/^\s{0,3}(?:#{1,6}|[-*+]|>|\d+\.)\s+/gm, "")
        .replace(/(\*\*|__|\*|`|~~)/g, "")
        .replace(/\s+/g, " ")
        .trim();
    if (plain.length <= max) return plain;
    const cut = plain.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(" ");
    return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).trimEnd()}…`;
}

export function applySeo(meta: SeoMeta, pathname: string): void {
    const description = meta.description || DEFAULT_DESCRIPTION;
    const url = canonicalUrl(meta.path ?? pathname);
    const image = meta.image ?? DEFAULT_IMAGE;

    document.title = meta.title;
    upsertMeta("name", "description", description);
    upsertCanonical(url);

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    if (meta.noindex) upsertMeta("name", "robots", "noindex, nofollow");
    else removeMeta("name", "robots");
}

/** Sets the page title and share/SEO tags. Pass null to leave them alone (e.g. while data loads). */
export function useSeo(meta: SeoMeta | null): void {
    const { pathname } = useLocation();
    const title = meta?.title;
    const description = meta?.description;
    const path = meta?.path;
    const noindex = meta?.noindex;
    const image = meta?.image;

    useEffect(() => {
        if (!title) return;
        applySeo({ title, description, path, noindex, image }, pathname);
    }, [title, description, path, noindex, image, pathname]);
}