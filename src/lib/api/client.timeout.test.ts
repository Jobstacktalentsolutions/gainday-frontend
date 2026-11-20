import type { InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { apiClient } from "./client";

const timeoutFor = async (url: string) => {
    let seen: InternalAxiosRequestConfig | undefined;
    await apiClient.get(url, {
        adapter: async (config) => {
            seen = config;
            return { data: {}, status: 200, statusText: "OK", headers: {}, config };
        },
    });
    return seen?.timeout;
};

describe("apiClient timeouts", () => {
    it("limits auth calls to 20 seconds", async () => {
        expect(await timeoutFor("/auth/employer/login")).toBe(20_000);
    });

    it("leaves slower endpoints without a limit", async () => {
        expect(await timeoutFor("/jobs")).toBe(0);
    });
});