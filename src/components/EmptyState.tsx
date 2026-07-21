import { PartyPopper, MousePointerClick } from 'lucide-react'

interface EmptyStateProps {
  variant: 'caught-up' | 'no-selection'
}

export function EmptyState({ variant }: EmptyStateProps) {
  if (variant === 'caught-up') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <PartyPopper aria-hidden size={28} className="text-brand" />
        <p className="font-medium text-ink">You're caught up.</p>
        <p className="text-sm text-muted">No urgent conversations remain in the queue.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      <MousePointerClick aria-hidden size={28} className="text-muted" />
      <p className="font-medium text-ink">Select a conversation</p>
      <p className="text-sm text-muted">Use {'\u2191\u2193'} or click a row in the queue to open it.</p>
    </div>
  )
}