import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingDisplayProps {
  rating: number
  count?: number
  showPills?: boolean
  foodRating?: number

  size?: 'sm' | 'md' | 'lg'
}

export function RatingDisplay({ rating, count, showPills, foodRating, size = 'sm' }: RatingDisplayProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }

  const iconClass = sizeClasses[size]
  const textClass = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'

  const getPillColor = (val: number) => {
    if (val >= 4.0) return "bg-status-success/10 text-status-success"
    if (val >= 3.0) return "bg-status-warning/10 text-status-warning"
    return "bg-status-error/10 text-status-error"
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          <Star className={cn(iconClass, "fill-brand-400 text-brand-400")} />
          <span className={cn("font-semibold text-stone-700", textClass)}>{rating.toFixed(1)}</span>
        </div>
        {count !== undefined && (
          <span className={cn("text-stone-400", size === 'sm' ? 'text-[10px]' : 'text-xs')}>
            ({count} reviews)
          </span>
        )}
      </div>

      {showPills && (foodRating) && (
        <div className="flex items-center gap-2 mt-1">
          {foodRating && (
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap", getPillColor(foodRating))}>
              Food {foodRating.toFixed(1)}
            </span>
          )}

        </div>
      )}
    </div>
  )
}
