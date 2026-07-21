import type { UrgencyTier } from '../types/conversation'

const TIER_CONFIG: Record<UrgencyTier, { label: string; bg: string; fg: string }> = {
  now: { label: 'Now', bg: 'bg-signal-now-bg', fg: 'text-signal-now' },
  soon: { label: 'Soon', bg: 'bg-signal-soon-bg', fg: 'text-signal-soon' },
  later: { label: 'Later', bg: 'bg-signal-later-bg', fg: 'text-signal-later' },
}

export function UrgencyBadge({ tier }: { tier: UrgencyTier }) {
  const config = TIER_CONFIG[tier]
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold tracking-wide ${config.bg} ${config.fg}`}
      aria-label={`Urgency: ${config.label}`}
    >
      {config.label.toUpperCase()}
    </span>
  )
}