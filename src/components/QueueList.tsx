import { useEffect, useRef } from 'react'
import type { Conversation, UrgencyResult, UrgencyTier } from '../types/conversation'
import { QueueRow } from './QueueRow'

interface QueueListProps {
  conversations: Conversation[]
  urgencyById: Map<string, UrgencyResult>
  selectedIndex: number
  onSelectIndex: (index: number) => void
}

const TIER_ORDER: UrgencyTier[] = ['now', 'soon', 'later']
const TIER_HEADING: Record<UrgencyTier, string> = { now: 'Now', soon: 'Soon', later: 'Later' }

export function QueueList({ conversations, urgencyById, selectedIndex, onSelectIndex }: QueueListProps) {
  const rowRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    rowRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const groups = TIER_ORDER.map((tier) => ({
    tier,
    items: conversations
      .map((c, flatIndex) => ({ conversation: c, flatIndex }))
      .filter(({ conversation }) => urgencyById.get(conversation.id)?.tier === tier),
  })).filter((group) => group.items.length > 0)

  return (
    <div role="listbox" aria-label="Conversation queue" className="flex-1 overflow-y-auto">
      {groups.map((group) => (
        <div key={group.tier}>
          <div className="sticky top-0 z-10 border-b border-line bg-canvas/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted backdrop-blur">
            {TIER_HEADING[group.tier]} <span className="font-mono tabular-nums">({group.items.length})</span>
          </div>
          <ul>
            {group.items.map(({ conversation, flatIndex }) => (
              <QueueRow
                key={conversation.id}
                ref={(el) => {
                  rowRefs.current[flatIndex] = el
                }}
                conversation={conversation}
                urgency={urgencyById.get(conversation.id)!}
                selected={flatIndex === selectedIndex}
                onSelect={() => onSelectIndex(flatIndex)}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}