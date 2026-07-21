interface ReasonChipsProps {
  reasons: string[]
  max?: number
  className?: string
}

export function ReasonChips({ reasons, max = 3, className = '' }: ReasonChipsProps) {
  const shown = reasons.slice(0, max)
  if (shown.length === 0) return null

  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {shown.map((reason) => (
        <li
          key={reason}
          className="flex items-center gap-1 rounded-full border border-line bg-white px-2 py-0.5 text-xs text-ink/80"
        >
          <span aria-hidden className="h-1 w-1 rounded-full bg-muted" />
          {reason}
        </li>
      ))}
    </ul>
  )
}