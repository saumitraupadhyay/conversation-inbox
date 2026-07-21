import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { UseMutationResult } from '@tanstack/react-query'
import type { Conversation } from '../types/conversation'
import type { UpdateStatusVars } from '../hooks/useConversations'
import { ChannelTag } from './ChannelTag'
import { ReasonChips } from './ReasonChips'
import { UrgencyBadge } from './UrgencyBadge'
import { ActionBar } from './ActionBar'
import { computeUrgency } from '../lib/urgency'
import { formatClockTime } from '../lib/time'

interface ConversationPanelProps {
  conversation: Conversation
  agentName: string
  mutation: UseMutationResult<Conversation, Error, UpdateStatusVars>
}

export function ConversationPanel({ conversation, agentName, mutation }: ConversationPanelProps) {
  const urgency = computeUrgency(conversation)
  const [draftReply, setDraftReply] = useState('')
  const [localReplies, setLocalReplies] = useState<string[]>([])

  function handleSend() {
    if (!draftReply.trim()) return
    setLocalReplies((prev) => [...prev, draftReply.trim()])
    setDraftReply('')
  }

  return (
    <div className="flex h-full flex-col animate-slide-in" aria-live="polite">
      <header className="border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-ink">{conversation.customerName}</h2>
          {conversation.tier === 'vip' && (
            <span className="rounded bg-brand/20 px-1.5 py-0.5 text-[11px] font-semibold text-ink/70">VIP</span>
          )}
          <UrgencyBadge tier={urgency.tier} />
        </div>
        <div className="mt-1">
          <ChannelTag channel={conversation.channel} />
        </div>
      </header>

      <div className="border-b border-line bg-brand/5 px-5 py-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/60">
          <Sparkles aria-hidden size={13} />
          AI summary
        </div>
        <p className="mt-1 text-sm text-ink/90">{conversation.aiSummary}</p>
        <ReasonChips reasons={urgency.reasons} className="mt-2" />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              message.author === 'customer'
                ? 'bg-canvas text-ink'
                : message.author === 'ai'
                  ? 'ml-auto bg-brand/10 text-ink/90'
                  : 'ml-auto bg-ink text-white'
            }`}
          >
            <p>{message.body}</p>
            <p className="mt-1 font-mono text-[10px] tabular-nums text-current/50">
              {formatClockTime(message.sentAt)}
            </p>
          </div>
        ))}
        {localReplies.map((reply, i) => (
          <div key={`local-${i}`} className="ml-auto max-w-[85%] rounded-lg bg-ink px-3 py-2 text-sm text-white">
            <p>{reply}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-line px-5 py-3">
        <label htmlFor="reply" className="sr-only">
          Write a reply
        </label>
        <textarea
          id="reply"
          value={draftReply}
          onChange={(e) => setDraftReply(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={'Write a reply... (\u2318/Ctrl + Enter to send)'}
          rows={2}
          className="w-full resize-none rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink/30"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSend}
            disabled={!draftReply.trim()}
            className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
          >
            Send reply
          </button>
        </div>
      </div>

      <ActionBar conversation={conversation} agentName={agentName} mutation={mutation} />
    </div>
  )
}