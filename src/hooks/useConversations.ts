import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchConversations, updateConversationStatus } from '../lib/api'
import type { Conversation, ConversationStatus } from '../types/conversation'

export const CONVERSATIONS_KEY = ['conversations'] as const

interface UpdateStatusVars {
  id: string
  status: ConversationStatus
  assignedAgent?: string | null
}

export type { UpdateStatusVars }

export function useConversationsQuery() {
  return useQuery({
    queryKey: CONVERSATIONS_KEY,
    queryFn: fetchConversations,
  })
}

export function useUpdateConversationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, assignedAgent }: UpdateStatusVars) =>
      updateConversationStatus(id, assignedAgent !== undefined ? { status, assignedAgent } : { status }),

    onMutate: async ({ id, status, assignedAgent }) => {
      await queryClient.cancelQueries({ queryKey: CONVERSATIONS_KEY })
      const previous = queryClient.getQueryData<Conversation[]>(CONVERSATIONS_KEY)

      queryClient.setQueryData<Conversation[]>(CONVERSATIONS_KEY, (old) =>
        old?.map((c) =>
          c.id === id
            ? { ...c, status, assignedAgent: assignedAgent !== undefined ? assignedAgent : c.assignedAgent }
            : c,
        ),
      )

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CONVERSATIONS_KEY, context.previous)
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY })
    },
  })
}