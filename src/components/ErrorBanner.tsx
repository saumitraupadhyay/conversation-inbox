interface ErrorBannerProps {
  message: string
  onRetry: () => void
  onDismiss: () => void
}

export function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 rounded-md border border-signal-now/30 bg-signal-now-bg px-3 py-2 text-sm text-signal-now"
    >
      <span>{message}</span>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="rounded border border-signal-now/40 px-2 py-1 text-xs font-medium hover:bg-white"
        >
          Retry
        </button>
        <button type="button" onClick={onDismiss} className="px-2 py-1 text-xs font-medium text-signal-now/70">
          Dismiss
        </button>
      </div>
    </div>
  )
}