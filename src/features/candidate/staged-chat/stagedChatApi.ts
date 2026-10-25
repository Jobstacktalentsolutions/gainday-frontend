import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

// Mirrors the backend StagedChatState (gainday-backend/src/modules/submissions/staged-chat).
export interface StagedChatTranscriptEntry {
    turn: number;
    customerMessage: string;
    typingDelayMs: number;
    candidateReply: string | null;
    candidateSentAt: string | null;
}

export interface StagedChatState {
    taskId: string;
    displayName: string;
    caseFile: { tabs: { label: string; content: string }[] };
    wordLimit: { min: number; max: number };
    turnCount: number;
    placeholder: string | null;
    status: "IN_PROGRESS" | "COMPLETE" | "INCOMPLETE";
    /** The turn the candidate answers next. Reads past the turn count once complete. */
    currentTurn: number;
    /** Released messages only: answered turns, plus the message currently on screen. */
    transcript: StagedChatTranscriptEntry[];
}

export interface PostStagedChatReplyInput {
    submissionId: string;
    taskId: string;
    turn: number;
    text: string;
    clientSentAt: string;
    idempotencyKey: string;
}

export interface PostStagedChatReplyResponse {
    turn: number;
    completed: boolean;
    nextCustomerMessage: { message: string; typingDelayMs: number } | null;
    currentTurn: number;
    turnCount: number;
}

const stateKey = (submissionId: string, taskId: string) => ["staged-chat", submissionId, taskId] as const;

export const useStagedChatState = (submissionId: string, taskId: string) =>
    useQuery({
        queryKey: stateKey(submissionId, taskId),
        queryFn: async () => {
            const { data } = await apiClient.get<StagedChatState>(
                `/submissions/${submissionId}/staged-chat/${taskId}`,
            );
            return data;
        },
        // The chat is a conversation: never serve a stale transcript from cache.
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

export const usePostStagedChatReply = (submissionId: string, taskId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: Omit<PostStagedChatReplyInput, "submissionId" | "taskId">) => {
            const { data } = await apiClient.post<PostStagedChatReplyResponse>(
                `/submissions/${submissionId}/staged-chat/${taskId}/turns/${input.turn}/reply`,
                {
                    text: input.text,
                    clientSentAt: input.clientSentAt,
                    idempotencyKey: input.idempotencyKey,
                },
            );
            return data;
        },
        // Whatever the outcome, the server's transcript is the truth: refetch it.
        onSettled: () => queryClient.invalidateQueries({ queryKey: stateKey(submissionId, taskId) }),
    });
};
