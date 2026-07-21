export function QueueSkeleton() {
  return (
    <ul>
      {Array.from({ length: 8 }, (_, i) => (
        <li key={i} className="space-y-2 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-28 rounded shimmer" />
            <div className="h-4 w-10 rounded shimmer" />
          </div>
          <div className="h-3 w-40 rounded shimmer" />
          <div className="h-3 w-56 rounded shimmer" />
        </li>
      ))}
    </ul>
  )
}

export function ConversationSkeleton() {
  return (
    <div className="space-y-4 px-5 py-4">
      <div className="h-5 w-40 rounded shimmer" />
      <div className="h-16 w-full rounded shimmer" />
      <div className="h-10 w-3/4 rounded shimmer" />
      <div className="ml-auto h-10 w-3/4 rounded shimmer" />
    </div>
  )
}