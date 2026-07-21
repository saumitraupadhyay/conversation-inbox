import type { Conversation } from '../types/conversation'

export function StatsStrip({ conversations }: { conversations: Conversation[] }) {
  const resolved = conversations.filter((c) => c.status === 'resolved').length
  const remaining = conversations.filter((c) => c.status === 'unassigned' || c.status === 'claimed').length

  return (
    <div className="flex items-center gap-3 font-mono text-xs tabular-nums text-muted">
      <span>
        <span className="font-semibold text-ink">{resolved}</span> resolved
      </span>
      <span aria-hidden>{'\u00b7'}</span>
      <span>
        <span className="font-semibold text-ink">{remaining}</span> remaining
      </span>
    </div>
  )
}