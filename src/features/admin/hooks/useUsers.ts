import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockUsers } from "../mocks/usersData";
import type { AdminUser } from "../types/user";

const SIMULATED_LATENCY_MS = 400;

//replace this with real api call once endpoint exists
async function fetchUsers () : Promise<AdminUser[]> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return mockUsers;
}

async function suspendUser(userId : string) : Promise<AdminUser> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const user =  mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    return {...user, status : "flagged"};
}

export function useUsers() {
    return useQuery({
        queryKey: ["admin", "users"],
        queryFn : fetchUsers,
    })
}

export function useSuspendUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : suspendUser,
        onSuccess : (updatedUser) => {
            queryClient.setQueryData<AdminUser[]>(["admin", "users"], (prev) =>
            prev?.map((u) => (u.id === updatedUser.id ? updatedUser : u) )
        )
        }
    })
}