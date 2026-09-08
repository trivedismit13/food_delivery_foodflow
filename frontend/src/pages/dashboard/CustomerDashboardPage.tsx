import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RatingModal } from '@/components/ui/RatingModal';
import { MapPin, User, Package, Users, History, Bell, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { DropCard } from '@/components/drops/DropCard';
import { useUserOrders } from '@/queries/orders';
import { useFollowedCreatorDrops } from '@/queries/drops';
import { useNotifications, useMarkAsRead, useMarkAllRead, useUnreadCount } from '@/queries/notifications';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { NotificationResponse } from '@/types/api';

type TabId = 'Orders' | 'Following' | 'Notifications' | 'Profile';

function resolveTab(param: string | null): TabId {
  const lower = (param || '').toLowerCase();
  if (lower === 'following') return 'Following';
  if (lower === 'notifications') return 'Notifications';
  if (lower === 'profile') return 'Profile';
  return 'Orders';
}

export default function CustomerDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<TabId>(resolveTab(tabParam));
  const [ordersTypeFilter, setOrdersTypeFilter] = useState<'All' | 'Pre-orders' | 'Regular Orders'>('Pre-orders');

  // Rating modal state
  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; restaurantId: number | null }>({
    isOpen: false,
    restaurantId: null,
  });

  // Update tab when URL changes (e.g. Navbar links)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setActiveTab(resolveTab(params.get('tab')));
  }, [location.search]);

  const { data: ordersPage, isLoading: isOrdersLoading } = useUserOrders(0);
  const userOrders = ordersPage?.content || [];

  const { data: followedDropsData, isLoading: isFollowedDropsLoading } = useFollowedCreatorDrops();
  const followedDrops = Array.isArray(followedDropsData)
    ? followedDropsData
    : (followedDropsData as any)?.content || [];

  // Notifications
  const { data: notifData, isLoading: isNotifsLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllRead } = useMarkAllRead();

  const notifications: NotificationResponse[] = notifData?.pages.flatMap(p => p.content) || [];

  // Infinite scroll sentinel for notifications
  const observerTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredOrders = userOrders.filter(o =>
    ordersTypeFilter === 'All' ? true :
    ordersTypeFilter === 'Pre-orders' ? !!o.dropId :
    !o.dropId
  );

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'Orders', label: 'My Orders', icon: History },
    { id: 'Following', label: 'Following', icon: Users },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Profile', label: 'Profile Settings', icon: User }
  ];

  const handleNotificationClick = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      markAsRead(notification.notificationId);
    }
    if (notification.referenceId && notification.referenceType) {
      if (notification.referenceType === 'DROP') navigate(`/drops/${notification.referenceId}`);
      if (notification.referenceType === 'ORDER') navigate(`/orders/${notification.referenceId}/track`);
      if (notification.referenceType === 'USER') navigate(`/creators/${notification.referenceId}`);
    }
  };

  const getNotifIcon = (type: string) => {
    switch(type) {
      case 'DROP_ANNOUNCED': return <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-base shrink-0">📢</div>;
      case 'DROP_OPEN': return <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-base shrink-0">🟢</div>;
      case 'ORDER_CONFIRMED': return <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-base shrink-0">✅</div>;
      case 'ORDER_READY': return <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-base shrink-0">🎉</div>;
      case 'ORDER_CANCELLED': return <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-base shrink-0">❌</div>;
      default: return <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center shrink-0"><Bell className="w-4 h-4 text-stone-500" /></div>;
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-20">

      {/* Rating Modal */}
      {ratingModal.restaurantId !== null && (
        <RatingModal
          restaurantId={ratingModal.restaurantId}
          isOpen={ratingModal.isOpen}
          onClose={() => setRatingModal({ isOpen: false, restaurantId: null })}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-stone-100 pt-10 pb-6">
        <div className="container mx-auto px-4 max-w-6xl flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-xl font-bold border-4 border-white shadow-sm shrink-0">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-stone-900">{user?.name || 'Customer'}</h1>
            <p className="text-stone-500 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="md:sticky md:top-24 bg-white rounded-2xl p-2 shadow-sm border border-stone-100 flex flex-row md:flex-col overflow-x-auto no-scrollbar">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 md:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-orange-50 text-orange-700 md:border-l-4 md:border-orange-500 md:rounded-l-none"
                        : "text-stone-600 hover:bg-stone-50 border-l-4 border-transparent"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-orange-500" : "text-stone-400")} />
                    {tab.label}
                    {tab.id === 'Notifications' && unreadCount > 0 && (
                      <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">

            {/* Orders Tab */}
            {activeTab === 'Orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                  <h2 className="text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
                    <Package className="w-6 h-6 text-orange-500" />
                    My Orders
                  </h2>

                  <div className="flex bg-white rounded-lg p-1 border border-stone-200 shadow-sm">
                    {(['All', 'Pre-orders', 'Regular Orders'] as const).map(filter => (
                      <button
                        key={filter}
                        onClick={() => setOrdersTypeFilter(filter)}
                        className={cn(
                          "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                          ordersTypeFilter === filter ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:text-stone-700"
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {isOrdersLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-100">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
                      <p className="text-stone-500">Loading your orders...</p>
                    </div>
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                    <div key={order.orderId} className={cn(
                      "bg-white rounded-2xl border transition-all shadow-sm flex flex-col overflow-hidden",
                      order.status === 'READY' ? "border-green-400 shadow-green-100" : "border-stone-100 hover:border-orange-200"
                    )}>

                      {order.status === 'READY' && (
                        <div className="bg-green-500 text-white px-5 py-2.5 text-sm font-bold flex items-center gap-2 animate-pulse">
                          <span>🟢</span> Your food is ready for collection!
                        </div>
                      )}

                      <div className="p-5 flex flex-col sm:flex-row gap-5 sm:items-center">
                        <div className="w-16 h-16 bg-stone-50 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl border border-stone-100">
                          {!!order.dropId ? '🍱' : '🛵'}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-stone-900 text-lg truncate">{order.restaurantName}</h3>
                            <span className="text-stone-300">•</span>
                            <span className="text-xs font-semibold text-stone-500">FF-{order.orderId}</span>
                            {!!order.dropId && (
                              <span className="ml-2 bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Pre-order</span>
                            )}
                          </div>
                          <p className="text-sm text-stone-600 truncate mb-3">
                            {order.items?.map(i => `${i.quantity} × ${i.itemName}`).join(', ')}
                          </p>

                          {!!order.dropId ? (
                            <div className="flex flex-wrap gap-x-6 gap-y-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                              <div className="flex items-center gap-2 text-sm text-stone-700">
                                <span className="text-stone-400">📅</span>
                                <span>Ordered on: <span className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</span></span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-stone-400">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-1 pl-0 sm:pl-5 sm:border-l border-stone-100 shrink-0">
                          <p className="font-display font-bold text-xl text-stone-900">₹{order.totalAmount}</p>
                          {order.status !== 'READY' && (
                            <StatusBadge status={order.status} className="mt-1" />
                          )}

                          <div className="flex gap-2 mt-4 w-full sm:w-auto">
                            {order.status === 'COMPLETED' ? (
                              <button
                                onClick={() =>
                                  setRatingModal({ isOpen: true, restaurantId: order.restaurantId })
                                }
                                className="flex-1 sm:flex-none px-5 py-2 rounded-xl border border-orange-500 text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-colors"
                              >
                                Rate Creator
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate(`/orders/${order.orderId}/track`)}
                                className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-stone-900 text-white text-sm font-bold hover:bg-stone-800 transition-colors shadow-sm"
                              >
                                Track Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
                      <Package className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                      <p className="text-stone-500 mb-6">No {ordersTypeFilter.toLowerCase()} found.</p>
                      <Button onClick={() => navigate('/drops')}>Discover Drops</Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Following' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-stone-900 mb-1">Active Drops From Creators You Follow</h2>
                  <p className="text-stone-500 text-sm">Order before the cutoff time.</p>
                </div>

                {isFollowedDropsLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-100">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
                    <p className="text-stone-500">Loading active drops...</p>
                  </div>
                ) : followedDrops && followedDrops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {followedDrops.map((drop: any) => (
                      <DropCard key={drop.dropId} {...drop} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
                    <Users className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                    <p className="text-stone-500 mb-4">No active drops from creators you follow right now.</p>
                    <Button onClick={() => navigate('/drops')}>Discover Drops</Button>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'Notifications' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-orange-500" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
                    )}
                  </h2>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllRead()}
                      className="text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {isNotifsLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-100">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
                    <p className="text-stone-500">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
                    <Bell className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                    <p className="text-stone-600 font-medium">No notifications yet</p>
                    <p className="text-sm text-stone-400 mt-1">Follow creators to get notified when they drop something new.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(notification => (
                      <div
                        key={notification.notificationId}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "bg-white rounded-xl p-4 flex items-start gap-3 transition-all cursor-pointer group",
                          !notification.isRead
                            ? "border border-orange-200 border-l-4 border-l-orange-500 bg-orange-50/30 shadow-sm"
                            : "border border-stone-100 hover:border-stone-200 hover:shadow-sm"
                        )}
                      >
                        {getNotifIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <h4 className="font-bold text-stone-900 text-sm truncate">{notification.title}</h4>
                            <span className="text-xs text-stone-400 whitespace-nowrap shrink-0">
                              {notification.timeAgo || formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">{notification.message}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          {notification.referenceId && (
                            <ArrowRight className="w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    ))}
                    {hasNextPage && (
                      <div ref={observerTarget} className="pt-4 text-center">
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="px-6 py-2 bg-stone-100 text-stone-600 font-semibold rounded-full hover:bg-stone-200 transition-colors text-sm"
                        >
                          {isFetchingNextPage ? 'Loading...' : 'Load more'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'Profile' && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-display font-bold text-stone-900">Personal Details</h2>
                  <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full font-medium">Read-only</span>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-stone-700">Full Name</label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        readOnly
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none text-stone-900 font-medium cursor-default"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-stone-700">Email Address</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 outline-none text-stone-500 cursor-default"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-stone-700">Phone Number</label>
                      <input
                        type="tel"
                        value="Not provided"
                        readOnly
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none text-stone-400 cursor-default italic"
                      />
                    </div>
                    {/* Customer location data is not required for pickup-based FoodFlow */}
                  </div>
                  <p className="text-xs text-stone-400">
                    Profile editing is not available in this version. Contact support if you need to update your details.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
