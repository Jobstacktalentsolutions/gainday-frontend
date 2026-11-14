import { beforeEach, describe, expect, it } from "vitest";
import { applySeo, summarise } from "./seo";

const count = (selector: string) => document.head.querySelectorAll(selector).length;

describe("applySeo", () => {
    beforeEach(() => {
        document.head.innerHTML = "";
        document.title = "";
    });

    it("sets the title, description, canonical and social tags", () => {
        applySeo({ title: "Pricing | Gainday", description: "Prices" }, "/pricing");
        expect(document.title).toBe("Pricing | Gainday");
        expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe("Prices");
        expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://gainday.org/pricing");
        expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe("Pricing | Gainday");
    });

    it("updates existing tags instead of adding duplicates", () => {
        applySeo({ title: "A" }, "/a");
        applySeo({ title: "B" }, "/b");
        expect(count('meta[name="description"]')).toBe(1);
        expect(count('link[rel="canonical"]')).toBe(1);
        expect(count('meta[property="og:title"]')).toBe(1);
    });

    it("adds robots noindex and removes it again", () => {
        applySeo({ title: "Private", noindex: true }, "/employer/jobs");
        expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, nofollow");
        applySeo({ title: "Public" }, "/pricing");
        expect(count('meta[name="robots"]')).toBe(0);
    });

    it("builds the canonical without query, hash or trailing slash", () => {
        applySeo({ title: "x" }, "/job-board/?role=sales#top");
        expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://gainday.org/job-board");
        applySeo({ title: "x" }, "/");
        expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://gainday.org/");
    });
});

describe("summarise", () => {
    it("strips markdown and HTML", () => {
        expect(summarise("## About\n**Own** the [pipeline](https://x.com) <b>end</b> to end")).toBe("About Own the pipeline end to end");
    });

    it("trims long text at a word boundary with an ellipsis", () => {
        const out = summarise("word ".repeat(100), 50);
        expect(out.length).toBeLessThanOrEqual(50);
        expect(out.endsWith("…")).toBe(true);
    });
});