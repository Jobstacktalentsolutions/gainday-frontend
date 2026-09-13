import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserStatus } from "../types/user";

/**
 * Factory that creates a typed suspend-mutation hook.
 *
 * Both employer and candidate suspend mutations do the same three things:
 *   1. Call an endpoint with a user ID
 *   2. Get back an updated record
 *   3. Optimistically patch a query-keyed list
 *
 * Extracting the pattern keeps the two hooks honest and avoids
 * them drifting apart in small annoying ways over time.
 */
export function createSuspendHook<
  T extends { id: string; status: UserStatus }
>(queryKey: readonly unknown[], suspendFn: (id: string) => Promise<T>) {
  return function useHook() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: suspendFn,
      onSuccess: (updated) => {
        queryClient.setQueryData<T[]>([...queryKey], (prev) =>
          prev?.map((item) => (item.id === updated.id ? updated : item))
        );
      },
    });
  };
}
