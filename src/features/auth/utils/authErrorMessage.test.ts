import { AxiosError, type AxiosResponse } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    authErrorMessage,
    EMAIL_TAKEN_MESSAGE,
    NETWORK_ERROR_MESSAGE,
    OFFLINE_MESSAGE,
    SERVER_ERROR_MESSAGE,
    TIMEOUT_MESSAGE,
} from "./authErrorMessage";

const httpError = (status: number, data?: unknown) =>
    new AxiosError("failed", undefined, undefined, undefined, { status, data } as AxiosResponse);

describe("authErrorMessage", () => {
    afterEach(() => vi.restoreAllMocks());

    it("shows the API's own message verbatim", () => {
        const error = httpError(409, { message: "That email is already registered" });
        expect(authErrorMessage(error, "fallback", { 409: EMAIL_TAKEN_MESSAGE })).toBe("That email is already registered");
    });

    it("joins a list of validation messages", () => {
        const error = httpError(400, { message: ["email must be an email", "password is too short"] });
        expect(authErrorMessage(error, "fallback")).toBe("email must be an email password is too short");
    });

    it("ignores framework reason phrases and uses the caller's status message", () => {
        const error = httpError(409, { statusCode: 409, message: "Conflict", error: "Conflict" });
        expect(authErrorMessage(error, "fallback", { 409: EMAIL_TAKEN_MESSAGE })).toBe(EMAIL_TAKEN_MESSAGE);
    });

    it("explains rate limiting", () => {
        expect(authErrorMessage(httpError(429), "fallback")).toMatch(/too many attempts/i);
    });

    it("reports a request that timed out", () => {
        const error = new AxiosError("timeout of 20000ms exceeded", "ECONNABORTED");
        expect(authErrorMessage(error, "fallback")).toBe(TIMEOUT_MESSAGE);
    });

    it("reports an offline device", () => {
        vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
        expect(authErrorMessage(new AxiosError("Network Error"), "fallback")).toBe(OFFLINE_MESSAGE);
    });

    it("reports an unreachable server when the device is online", () => {
        vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
        expect(authErrorMessage(new AxiosError("Network Error"), "fallback")).toBe(NETWORK_ERROR_MESSAGE);
    });

    it("reports server errors", () => {
        expect(authErrorMessage(httpError(500, { message: "Internal server error" }), "fallback")).toBe(SERVER_ERROR_MESSAGE);
    });

    it("falls back when nothing more specific is known", () => {
        expect(authErrorMessage(httpError(401), "fallback")).toBe("fallback");
        expect(authErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
    });
});