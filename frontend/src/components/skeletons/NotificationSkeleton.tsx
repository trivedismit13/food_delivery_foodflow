export function NotificationSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 flex gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-stone-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-200 rounded w-1/2" />
      </div>
      <div className="w-8 h-4 bg-stone-200 rounded shrink-0" />
    </div>
  )
}
