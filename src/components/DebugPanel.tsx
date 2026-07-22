import { useSyncExternalStore } from 'react'
import { Bug } from 'lucide-react'
import { getDebugState, setDebugState, subscribeDebugState } from '../mocks/debugState'
import { useQueryClient } from '@tanstack/react-query'
import { CONVERSATIONS_KEY } from '../hooks/useConversations'

const TOGGLES: { key: 'forceFailure' | 'slowNetwork' | 'emptyQueue'; label: string }[] = [
  { key: 'forceFailure', label: 'Force API failure' },
  { key: 'slowNetwork', label: 'Slow network' },
  { key: 'emptyQueue', label: 'Empty queue' },
]

export function DebugPanel() {
  const state = useSyncExternalStore(subscribeDebugState, getDebugState)
  const queryClient = useQueryClient()

  return (
    <div className="fixed bottom-3 left-3 w-52 rounded-md border border-line bg-surface/95 p-3 text-xs shadow-panel backdrop-blur">
      <div className="mb-2 flex items-center gap-1.5 font-semibold text-ink">
        <Bug aria-hidden size={13} />
        Developer tools
      </div>
      <div className="space-y-1.5">
        {TOGGLES.map(({ key, label }) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 text-ink/80">
            <input
              type="checkbox"
              checked={state[key]}
              onChange={(e) => {
                const value = e.target.checked
                if (key === 'forceFailure') setDebugState({ forceFailure: value })
                else if (key === 'slowNetwork') setDebugState({ slowNetwork: value })
                else setDebugState({ emptyQueue: value })
                void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY })
              }}
              className="h-3.5 w-3.5"
            />
            {label}
          </label>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted">Dev build only {'\u2014'} not part of the shipped product.</p>
    </div>
  )
}
