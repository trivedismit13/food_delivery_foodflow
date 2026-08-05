import { useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowRight, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNotifications, useUnreadCount, useMarkAllRead, useMarkAsRead } from '@/queries/notifications';
import { NotificationResponse } from '@/types/api';

export default function NotificationsPage() {
  const navigate = useNavigate();
  
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications();
  const { mutate: markAllRead } = useMarkAllRead();
  const { mutate: markAsRead } = useMarkAsRead();

  const notifications = data?.pages.flatMap(page => page.content) || [];

  const handleMarkAllAsRead = () => {
    markAllRead();
  };

  const handleNotificationClick = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      markAsRead(notification.notificationId);
    }
    
    // Navigate
    if (notification.referenceId && notification.referenceType) {
      if (notification.referenceType === 'DROP') navigate(`/drops/${notification.referenceId}`);
      if (notification.referenceType === 'ORDER') navigate(`/orders/${notification.referenceId}/track`);
      if (notification.referenceType === 'USER') navigate(`/creators/${notification.referenceId}`);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'DROP_ANNOUNCED': return <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg">📢</div>;
      case 'DROP_OPEN': return <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">🟢</div>;
      case 'DROP_CLOSING_SOON': return <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg">⏰</div>;
      case 'ORDER_CONFIRMED': return <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg">✅</div>;
      case 'ORDER_READY': return <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">🎉</div>;
      case 'ORDER_CANCELLED': return <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg">❌</div>;
      case 'NEW_FOLLOWER': return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg">👤</div>;
      case 'LOW_STOCK': return <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg">⚠️</div>;
      default: return <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center"><Bell size={18} /></div>;
    }
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupName = '';
    if (date.toDateString() === today.toDateString()) {
      groupName = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupName = 'Yesterday';
    } else {
      groupName = 'Earlier this week';
    }
    
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(notification);
    return groups;
  }, {} as Record<string, NotificationResponse[]>);

  return (
    <div className="bg-stone-50 min-h-screen pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-stone-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-100">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
              <Bell size={32} />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">No notifications yet</h2>
            <p className="text-stone-500 max-w-sm mx-auto">
              Follow creators to get notified when they announce new drops and track your order updates here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedNotifications).map(([dateLabel, groupNotes]) => (
              <div key={dateLabel}>
                
                {/* Date Divider */}
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 shrink-0">{dateLabel}</h3>
                  <div className="h-px bg-stone-200 w-full flex-1"></div>
                </div>

                <div className="space-y-3">
                  {groupNotes.map((notification) => (
                    <div 
                      key={notification.notificationId}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "bg-white rounded-xl p-4 md:p-5 flex items-start sm:items-center gap-4 transition-all cursor-pointer group",
                        !notification.isRead 
                          ? "border border-orange-200 border-l-4 border-l-orange-500 bg-orange-50/30 shadow-sm" 
                          : "border border-stone-100 hover:border-stone-200 hover:shadow-sm"
                      )}
                    >
                      {/* Icon */}
                      <div className="shrink-0 pt-1 sm:pt-0">
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                          <h4 className="font-bold text-stone-900 text-[15px]">{notification.title}</h4>
                          <span className="text-xs text-stone-400 font-medium whitespace-nowrap shrink-0">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-stone-600 leading-relaxed pr-6">{notification.message}</p>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 flex items-center gap-4 pt-1 sm:pt-0">
                        {notification.referenceId && (
                          <span className="text-sm font-bold text-orange-500 hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View <ArrowRight size={14}/>
                          </span>
                        )}
                        {!notification.isRead && (
                          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {hasNextPage && (
              <div className="pt-8 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 bg-stone-100 text-stone-600 font-semibold rounded-full hover:bg-stone-200 transition-colors"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
