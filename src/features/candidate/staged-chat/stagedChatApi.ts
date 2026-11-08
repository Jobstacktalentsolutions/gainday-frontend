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
    const key = stateKey(submissionId, taskId);

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
        onMutate: async (newReply) => {
            await queryClient.cancelQueries({ queryKey: key });
            const previousState = queryClient.getQueryData<StagedChatState>(key);

            // Optimistically update the candidate reply immediately so it renders with zero delay
            if (previousState) {
                queryClient.setQueryData<StagedChatState>(key, {
                    ...previousState,
                    transcript: previousState.transcript.map((entry) =>
                        entry.turn === newReply.turn
                            ? {
                                  ...entry,
                                  candidateReply: newReply.text,
                                  candidateSentAt: newReply.clientSentAt,
                              }
                            : entry,
                    ),
                });
            }

            return { previousState };
        },
        onSuccess: (data, input) => {
            queryClient.setQueryData<StagedChatState>(key, (current) => {
                if (!current) return current;

                const transcript = current.transcript.map((entry) =>
                    entry.turn === input.turn
                        ? {
                              ...entry,
                              candidateReply: input.text,
                              candidateSentAt: input.clientSentAt,
                          }
                        : entry,
                );

                if (data.nextCustomerMessage && !data.completed) {
                    const alreadyPresent = transcript.some((t) => t.turn === data.currentTurn);
                    if (!alreadyPresent) {
                        transcript.push({
                            turn: data.currentTurn,
                            customerMessage: data.nextCustomerMessage.message,
                            typingDelayMs: 0,
                            candidateReply: null,
                            candidateSentAt: null,
                        });
                    }
                }

                return {
                    ...current,
                    status: data.completed ? "COMPLETE" : current.status,
                    currentTurn: data.currentTurn,
                    transcript,
                };
            });
        },
        onError: (_err, _newReply, context) => {
            if (context?.previousState) {
                queryClient.setQueryData(key, context.previousState);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: key });
        },
    });
};
