import { useEffect } from 'react'
import { useQueryClient, InfiniteData } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { connectWebSocket, disconnectWebSocket } from '@/lib/websocket'
import type { NotificationResponse, Page } from '@/types/api'

// Simple helper to generate toast content and navigation target
function getNotificationToast(notification: NotificationResponse) {
  return {
    title: notification.title,
    description: notification.message,
  }
}

function navigateToReference(notification: NotificationResponse, navigate: any) {
  if (notification.referenceType === 'DROP') {
    navigate(`/drops/${notification.referenceId}`)
  } else if (notification.referenceType === 'ORDER') {
    navigate(`/orders/${notification.referenceId}/track`)
  } else if (notification.referenceType === 'USER') {
    navigate(`/creators/${notification.referenceId}`)
  }
}

export function useWebSocket() {
  const { user, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!isAuthenticated || !user) {
      disconnectWebSocket()
      return
    }
    
    connectWebSocket(user.userId, (notification) => {
      // 1. Update unread count badge immediately
      queryClient.setQueryData(
        ['notifications', 'unread-count'],
        (old: number | undefined) => (old || 0) + 1
      )
      
      // 2. Add notification to top of notifications list
      queryClient.setQueryData(
        ['notifications'],
        (old: InfiniteData<Page<NotificationResponse>> | undefined) => {
          if (!old) return old
          const newPages = [...old.pages]
          newPages[0] = {
            ...newPages[0],
            content: [notification, ...newPages[0].content],
          }
          return { ...old, pages: newPages }
        }
      )
      // 3. Invalidate relevant queries to fetch fresh data
      if (notification.type === 'ORDER_READY' || notification.type === 'ORDER_CONFIRMED') {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        if (notification.referenceId) {
          queryClient.invalidateQueries({ queryKey: ['order', notification.referenceId] })
        }
      } else if (notification.type.startsWith('DROP_')) {
        queryClient.invalidateQueries({ queryKey: ['drops'] })
        if (notification.referenceId) {
          queryClient.invalidateQueries({ queryKey: ['drop', notification.referenceId] })
        }
      }

      // 4. Show toast for the notification
      const toastMessage = getNotificationToast(notification)
      toast(toastMessage.title, {
        description: toastMessage.description,
        action: notification.referenceId ? {
          label: 'View',
          onClick: () => navigateToReference(notification, navigate),
        } : undefined,
      })
    })
    
    return () => disconnectWebSocket()
  }, [isAuthenticated, user?.userId, queryClient, navigate])
}
