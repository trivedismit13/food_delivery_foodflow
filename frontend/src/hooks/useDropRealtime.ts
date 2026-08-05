import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { subscribeToDropUpdates, type DropUpdateMessage } from '@/lib/websocket'
import type { FoodDropResponse } from '@/types/api'

export function useDropRealtime(
  dropId: number | undefined,
  onUpdate: (update: DropUpdateMessage) => void
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!dropId) return
    
    const unsubscribe = subscribeToDropUpdates(dropId, (update) => {
      // Update TanStack Query cache with new slot count
      queryClient.setQueryData(
        ['drop', dropId],
        (old: FoodDropResponse | undefined) => {
          if (!old) return old
          return {
            ...old,
            currentOrders: update.currentOrders,
            availableSlots: update.availableSlots,
            isSoldOut: update.isSoldOut,
          }
        }
      )
      onUpdate(update)
    })
    
    return unsubscribe
  }, [dropId, queryClient, onUpdate])
}
