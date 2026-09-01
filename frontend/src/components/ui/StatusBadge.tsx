import { cn } from "@/lib/utils"

import type { OrderStatus } from '@/types/api'
interface StatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<OrderStatus, string> = {
    PLACED: "bg-blue-50 text-blue-600 border-blue-200",
    PREPARING: "bg-amber-50 text-amber-600 border-amber-200",
    READY: "bg-green-50 text-green-600 border-green-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200"
  }
  
  const labels: Record<OrderStatus, string> = {
    PLACED: "Order Placed",
    PREPARING: "Preparing",
    READY: "Ready",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled"
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
      styles[status],
      className
    )}>

      {labels[status]}
    </span>
  )
}
