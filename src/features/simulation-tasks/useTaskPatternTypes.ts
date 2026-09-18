import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { InterfaceType, ObjectiveComponentType, OpenEndedComponentType } from "./types";

export interface TaskPatternType {
    categoryKeys: string[];
    key: string;
    label: string;
    description: string;
    objectiveComponentType?: ObjectiveComponentType;
    openEndedComponentType?: OpenEndedComponentType;
    interfaceType: InterfaceType;
}

const fetchTaskPatternTypes = async (): Promise<TaskPatternType[]> => {
    const { data } = await apiClient.get<TaskPatternType[]>(
        "/admin/task-pattern-types",
    );
    return data;
};

// Tells the admin edit form which objectiveComponentType/openEndedComponentType applies to a
// given taskType — that mapping lives in the backend's role modules, not on the task itself.
export const useTaskPatternTypes = () => {
    return useQuery({
        queryKey: ["admin", "task-pattern-types"],
        queryFn: fetchTaskPatternTypes,
        staleTime: 5 * 60 * 1000,
    });
};
