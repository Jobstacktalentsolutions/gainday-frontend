import { useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TaskCard from "./TaskCard";
import { simulationBuilderSchema, type JobPostingFormValues } from "../schemas/jobPosting";
import { InterfaceType } from "@/features/simulation-tasks/types";

const task: JobPostingFormValues["tasks"][number] = {
    id: "task-1", questionBankId: "question-1", taskType: "EMAIL", category: "Communication",
    title: "Respond to a message", scenarioDescription: "A customer wrote to you.", questionPrompt: "Write a response.",
    businessProblemDerived: false, interfaceType: InterfaceType.TEXT_AREA,
    interfacePayload: { interfaceType: InterfaceType.TEXT_AREA, placeholder: null },
};

function Harness({ review }: { review?: boolean }) {
    const form = useForm<JobPostingFormValues>({ defaultValues: { tasks: [{ ...task, expectedDurationMinutes: 5, ...(review === undefined ? {} : { inReview: review }) }] } });
    const [showEditor, setShowEditor] = useState(true);
    const tasks = useWatch({ control: form.control, name: "tasks" });
    return <FormProvider {...form}>
        <button type="button" onClick={() => setShowEditor(!showEditor)}>{showEditor ? "Preview" : "Back"}</button>
        {showEditor && <Editor control={form.control} />}
        <button type="button" disabled={!simulationBuilderSchema.safeParse({ tasks }).success}>Continue</button>
        <output data-testid="tasks">{JSON.stringify(tasks)}</output>
    </FormProvider>;
}

function Editor({ control }: { control: ReturnType<typeof useForm<JobPostingFormValues>>["control"] }) {
    const { fields } = useFieldArray({ control, name: "tasks", keyName: "fieldKey" });
    return fields.map((field, index) => <TaskCard key={field.fieldKey} index={index} expanded={false} onToggleExpand={() => {}} onRemove={() => {}} onRegenerate={() => {}} />);
}

describe("task editor navigation", () => {
    it.each([undefined, true, false])("keeps Continue enabled after preview and back with review state %s", (review) => {
        render(<Harness review={review} />);
        expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
        fireEvent.click(screen.getByRole("button", { name: "Preview" }));
        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
        expect(JSON.parse(screen.getByTestId("tasks").textContent!)).toEqual([{ ...task, expectedDurationMinutes: 5, ...(review === undefined ? {} : { inReview: review }) }]);
    });
});
