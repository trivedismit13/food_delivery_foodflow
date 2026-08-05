import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { NotificationResponse } from '@/types/api'

export interface DropUpdateMessage {
  dropId: number
  currentOrders: number
  maxOrders: number
  availableSlots: number
  isSoldOut: boolean
  timestamp: string
}

let stompClient: Client | null = null
let pendingSubscriptions: Array<{ topic: string; callback: (message: any) => void }> = []
let isConnected = false

export function connectWebSocket(
  userId: number,
  onNotification: (notification: NotificationResponse) => void
) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    reconnectDelay: 5000,
    
    onConnect: () => {
      console.log('WebSocket connected')
      isConnected = true
      
      stompClient?.subscribe(
        `/user/${userId}/queue/notifications`,
        (message) => {
          const notification: NotificationResponse = JSON.parse(message.body)
          onNotification(notification)
        }
      )

      // Process pending subscriptions
      pendingSubscriptions.forEach(sub => {
        stompClient?.subscribe(sub.topic, sub.callback)
      })
      pendingSubscriptions = []
    },
    
    onDisconnect: () => {
      console.log('WebSocket disconnected')
      isConnected = false
    },
    
    onStompError: (frame) => {
      console.error('STOMP error', frame)
    },
  })
  
  stompClient.activate()
}

export function subscribeToDropUpdates(
  dropId: number,
  onUpdate: (update: DropUpdateMessage) => void
): () => void {
  const topic = `/topic/drops/${dropId}`
  const callback = (message: any) => {
    const update: DropUpdateMessage = JSON.parse(message.body)
    onUpdate(update)
  }

  if (stompClient && stompClient.connected) {
    const subscription = stompClient.subscribe(topic, callback)
    return () => subscription.unsubscribe()
  } else {
    pendingSubscriptions.push({ topic, callback })
    return () => {
      pendingSubscriptions = pendingSubscriptions.filter(sub => sub.topic !== topic)
    }
  }
}

export function disconnectWebSocket() {
  stompClient?.deactivate()
  stompClient = null
  isConnected = false
  pendingSubscriptions = []
}
