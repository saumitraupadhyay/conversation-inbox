import { useEffect, useMemo, useState } from 'react'
import { QueueList } from './components/QueueList'
import { useConversationsQuery, useUpdateConversationStatus } from './hooks/useConversations'
import { ConversationPanel } from './components/ConversationPanel'
import { computeUrgency, sortByUrgency } from './lib/urgency'

const CURRENT_AGENT = 'Alex Rivera'

export default function App() {
  const { data: conversations, isLoading, isError, error, refetch } = useConversationsQuery()
  const mutation = useUpdateConversationStatus()

  // Re-derive urgency on a slow tick so SLA countdowns and wait times
  // stay roughly live without needing a real-time backend.
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const now = useMemo(() => new Date(), [tick])
  const sorted = useMemo(
    () => (conversations ? sortByUrgency(conversations, now) : []),
    [conversations, now],
  )
  const urgencyById = useMemo(
    () => new Map(sorted.map((c) => [c.id, computeUrgency(c, now)])),
    [sorted, now],
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(sorted.length - 1, 0)))
  }, [sorted.length])

  const selected = sorted[selectedIndex]

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <div>
          <h1 className="text-sm font-semibold uppercase tracking-wide text-ink">Triage Queue</h1>
          <p className="text-xs text-muted">Signed in as {CURRENT_AGENT}</p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[380px] shrink-0 flex-col border-r border-line">
          {/* {isLoading && <QueueSkeleton />} */}

          {isError && (
            <div className="p-4">
              {/* <ErrorBanner
                message={error instanceof Error ? error.message : 'Could not load the queue.'}
                onRetry={() => void refetch()}
                onDismiss={() => void refetch()}
              /> */}
            </div>
          )}

          {/* {!isLoading && !isError && sorted.length === 0 && <EmptyState variant="caught-up" />} */}

          {!isLoading && !isError && sorted.length > 0 && (
            <QueueList
              conversations={sorted}
              urgencyById={urgencyById}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
            />
          )}
        </div>

        <main className="min-w-0 flex-1">
          {/* {isLoading && <ConversationSkeleton />} */}
          {!isLoading && selected && (
            <ConversationPanel key={selected.id} conversation={selected} agentName={CURRENT_AGENT} mutation={mutation} />
          )}
          {/* {!isLoading && !selected && <EmptyState variant="no-selection" />} */}
        </main>
      </div>

      {/* <KeyboardHints /> */}
    </div>
  )
}