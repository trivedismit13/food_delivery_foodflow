export type NotificationType = 
  | 'DROP_ANNOUNCED'
  | 'DROP_OPEN'
  | 'DROP_CLOSING_SOON'
  | 'ORDER_CONFIRMED'
  | 'ORDER_READY'
  | 'ORDER_CANCELLED'
  | 'NEW_FOLLOWER'
  | 'LOW_STOCK';

export interface NotificationResponse {
  notificationId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceType: 'DROP' | 'ORDER' | 'USER' | null;
  referenceId: number | null;
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
}
