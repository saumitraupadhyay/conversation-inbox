export function formatWaitTime(iso: string, now: Date = new Date()): string {
  const ms = now.getTime() - new Date(iso).getTime()
  const minutes = Math.max(0, Math.round(ms / 60_000))

  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ${minutes % 60}m`
  const days = Math.floor(hours / 24)
  return `${days}d ${hours % 24}h`
}

export function formatClockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}