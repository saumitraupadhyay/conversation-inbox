const HINTS: { keys: string; label: string }[] = [
  { keys: '\u2191\u2193', label: 'Navigate' },
  { keys: 'Enter', label: 'Open' },
  { keys: 'C', label: 'Claim' },
  { keys: 'R', label: 'Resolve' },
  { keys: 'S', label: 'Snooze' },
]

export function KeyboardHints() {
  return (
    <div
      className="pointer-events-none fixed bottom-3 right-3 hidden items-center gap-3 rounded-md border border-line bg-surface/95 px-3 py-1.5 text-xs text-muted shadow-panel backdrop-blur md:flex"
      aria-hidden="true"
    >
      {HINTS.map((hint) => (
        <span key={hint.label} className="flex items-center gap-1">
          <kbd className="rounded border border-line bg-canvas px-1 font-mono text-[11px]">{hint.keys}</kbd>
          {hint.label}
        </span>
      ))}
    </div>
  )
}