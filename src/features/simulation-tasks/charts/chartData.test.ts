import { describe, expect, it } from "vitest";
import { waterfallSteps } from "./chartData";

describe("waterfallSteps", () => {
    it("floats each driver from where the previous step ended", () => {
        const steps = waterfallSteps(
            ["Budget", "Price", "Volume", "Actual"],
            [500, 40, -25, 515],
            [true, false, false, true],
        );
        expect(steps).toEqual([
            { category: "Budget", base: 0, height: 500, kind: "total", value: 500 },
            { category: "Price", base: 500, height: 40, kind: "increase", value: 40 },
            { category: "Volume", base: 515, height: 25, kind: "decrease", value: -25 },
            { category: "Actual", base: 0, height: 515, kind: "total", value: 515 },
        ]);
    });
});
