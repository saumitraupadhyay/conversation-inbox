import { forwardRef } from 'react'
import type { Conversation, UrgencyResult } from '../types/conversation'
import { UrgencyBadge } from './UrgencyBadge'
import { ReasonChips } from './ReasonChips'
import { ChannelTag } from './ChannelTag'
import { formatWaitTime } from '../lib/time'

interface QueueRowProps {
  conversation: Conversation
  urgency: UrgencyResult
  selected: boolean
  onSelect: () => void
}

const STATUS_LABEL: Record<Conversation['status'], string> = {
  unassigned: '',
  claimed: 'Claimed',
  resolved: 'Resolved',
  snoozed: 'Snoozed',
}

export const QueueRow = forwardRef<HTMLLIElement, QueueRowProps>(function QueueRow(
  { conversation, urgency, selected, onSelect },
  ref,
) {
  const isInactive = conversation.status === 'resolved' || conversation.status === 'snoozed'

  return (
    <li
      ref={ref}
      role="option"
      aria-selected={selected}
      tabIndex={-1}
      onClick={onSelect}
      className={[
        'cursor-pointer border-b border-line px-4 py-3 transition-colors',
        selected ? 'bg-brand/10' : 'hover:bg-black/[0.02]',
        isInactive ? 'opacity-50' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-ink">{conversation.customerName}</span>
            {conversation.tier === 'vip' && (
              <span className="rounded bg-brand/20 px-1 text-[10px] font-semibold text-ink/70">VIP</span>
            )}
            <UrgencyBadge tier={urgency.tier} />
            {STATUS_LABEL[conversation.status] && (
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                {STATUS_LABEL[conversation.status]}
              </span>
            )}
          </div>

          <ReasonChips reasons={urgency.reasons} max={2} className="mt-1.5" />

          <p className="mt-1.5 truncate text-sm text-ink/70">
            {conversation.messages[conversation.messages.length - 1]?.body}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
          <ChannelTag channel={conversation.channel} />
          <span className="font-mono text-xs tabular-nums text-muted">
            {formatWaitTime(conversation.escalatedAt)}
          </span>
        </div>
      </div>
    </li>
  )
})