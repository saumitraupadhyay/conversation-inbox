import { CheckCircle2, Clock, Loader2, UserCheck } from 'lucide-react'
import type { UseMutationResult } from '@tanstack/react-query'
import { ErrorBanner } from './ErrorBanner'
import type { UpdateStatusVars } from '../hooks/useConversations'
import type { Conversation, ConversationStatus } from '../types/conversation'

interface ActionBarProps {
  conversation: Conversation
  agentName: string
  mutation: UseMutationResult<Conversation, Error, UpdateStatusVars>
}

const BUTTONS: { status: ConversationStatus; label: string; pastLabel: string; Icon: typeof CheckCircle2 }[] = [
  { status: 'claimed', label: 'Claim', pastLabel: 'Claimed', Icon: UserCheck },
  { status: 'resolved', label: 'Resolve', pastLabel: 'Resolved', Icon: CheckCircle2 },
  { status: 'snoozed', label: 'Snooze', pastLabel: 'Snoozed', Icon: Clock },
]

export function ActionBar({ conversation, agentName, mutation }: ActionBarProps) {
  function handleClick(status: ConversationStatus) {
    mutation.mutate({
      id: conversation.id,
      status,
      assignedAgent: status === 'claimed' ? agentName : conversation.assignedAgent,
    })
  }

  return (
    <div className="space-y-2 border-t border-line bg-surface px-4 py-3">
      {mutation.isError && (
        <ErrorBanner
          message={mutation.error instanceof Error ? mutation.error.message : 'Something went wrong.'}
          onRetry={() => mutation.mutate(mutation.variables!)}
          onDismiss={() => mutation.reset()}
        />
      )}

      <div className="flex gap-2">
        {BUTTONS.map(({ status, label, pastLabel, Icon }) => {
          const isActive = conversation.status === status
          const isPending = mutation.isPending && mutation.variables?.status === status
          return (
            <button
              key={status}
              type="button"
              disabled={isActive}
              onClick={() => handleClick(status)}
              className={[
                'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-line bg-canvas text-muted'
                  : 'border-ink/15 text-ink hover:border-ink/30 hover:bg-black/[0.02]',
              ].join(' ')}
              aria-keyshortcuts={status === 'claimed' ? 'c' : status === 'resolved' ? 'r' : 's'}
            >
              {isPending ? <Loader2 aria-hidden size={15} className="animate-spin" /> : <Icon aria-hidden size={15} />}
              {isActive ? pastLabel : label}
            </button>
          )
        })}
      </div>
    </div>
  )
}