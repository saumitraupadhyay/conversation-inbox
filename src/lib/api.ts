import type { Conversation, ConversationStatus } from '../types/conversation'

export class ApiError extends Error {}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch('/api/conversations')
  if (!res.ok) throw new ApiError('Could not load the queue.')
  return res.json() as Promise<Conversation[]>
}

export async function updateConversationStatus(
  id: string,
  patch: { status: ConversationStatus; assignedAgent?: string | null },
): Promise<Conversation> {
  const res = await fetch(`/api/conversations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null
    throw new ApiError(body?.message ?? 'Could not save this change.')
  }
  return res.json() as Promise<Conversation>
}