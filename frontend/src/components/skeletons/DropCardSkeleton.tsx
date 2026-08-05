export function DropCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="h-[200px] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-stone-200 rounded-lg w-3/4" />
        <div className="h-4 bg-stone-200 rounded-lg w-1/2" />
        <div className="h-2 bg-stone-200 rounded-full w-full" />
        <div className="flex justify-between">
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-8 bg-stone-200 rounded-lg w-24" />
        </div>
      </div>
    </div>
  )
}
