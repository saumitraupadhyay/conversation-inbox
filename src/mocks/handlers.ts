import { http, HttpResponse, delay } from 'msw'
import { ALWAYS_FAILS_ID, generateMockConversations } from './data'
import { getDebugState } from './debugState'
import type { Conversation, ConversationStatus } from '../types/conversation'

// Module-level store so writes persist for the life of the tab (resets on
// reload - documented as a known limitation in the README, there's no
// backend to persist to per the brief's constraints).
let store: Conversation[] = generateMockConversations()

async function simulatedDelay() {
  const { slowNetwork } = getDebugState()
  const [min, max]: [number, number] = slowNetwork ? [2000, 3500] : [200, 500]
  await delay(min + Math.random() * (max - min))
}

export const handlers = [
  http.get('/api/conversations', async () => {
    await simulatedDelay()
    const { emptyQueue } = getDebugState()
    return HttpResponse.json(emptyQueue ? [] : store)
  }),

  http.patch('/api/conversations/:id', async ({ params, request }) => {
    await simulatedDelay()

    const { forceFailure } = getDebugState()
    const id = String(params.id)

    if (forceFailure || id === ALWAYS_FAILS_ID) {
      return HttpResponse.json(
        { message: 'The server could not save this change. Please try again.' },
        { status: 500 },
      )
    }

    const body = (await request.json()) as { status?: ConversationStatus; assignedAgent?: string | null }
    const index = store.findIndex((c) => c.id === id)
    if (index === -1) {
      return HttpResponse.json({ message: 'Conversation not found.' }, { status: 404 })
    }

    const current = store[index]
    if (!current) {
      return HttpResponse.json({ message: 'Conversation not found.' }, { status: 404 })
    }

    const updated: Conversation = {
      ...current,
      status: body.status ?? current.status,
      assignedAgent: body.assignedAgent !== undefined ? body.assignedAgent : current.assignedAgent,
    }
    store = [...store.slice(0, index), updated, ...store.slice(index + 1)]

    return HttpResponse.json(updated)
  }),
]