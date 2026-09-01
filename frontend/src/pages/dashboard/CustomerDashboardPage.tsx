import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MapPin, User, Package, Users, History, Edit2, Bell, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { CreatorCard } from '@/components/creators/CreatorCard';
import { DropCard, DropStatus } from '@/components/drops/DropCard';
import { useUserOrders } from '@/queries/orders';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState('Orders');
  const [ordersTypeFilter, setOrdersTypeFilter] = useState<'All' | 'Pre-orders' | 'Regular Orders'>('Pre-orders');
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const { data: ordersPage, isLoading: isOrdersLoading } = useUserOrders(0);
  const userOrders = ordersPage?.content || [];
  
  // Mock Data
  const now = new Date();
  
  const mockFollowedCreators = [
    {
      id: 1,
      name: "Priya's Kitchen",
      type: "Home Chef",
      city: "Mumbai",
      verificationLevel: 2 as const,
      followerCount: 312,
      totalOrders: 847,
      rating: 4.8,
      isFollowing: true,
      hasActiveDrop: true
    },
    {
      id: 2,
      name: "The Sugar Studio",
      type: "Home Baker",
      city: "Mumbai",
      verificationLevel: 1 as const,
      followerCount: 124,
      totalOrders: 156,
      rating: 4.9,
      isFollowing: true,
      hasActiveDrop: false
    }
  ];

  const mockActiveDropFromFollowed = {
    dropId: 1,
    title: "Sunday Special Mutton Biryani",
    creatorId: 1,
    creatorName: "Priya's Kitchen",
    creatorVerificationLevel: 2 as const,
    status: 'OPEN' as DropStatus,
    maxOrders: 20,
    currentOrders: 18,
    orderCutoffTime: new Date(now.getTime() + 1000 * 60 * 90).toISOString(),
    dropDate: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
    pickupLocation: "Near VIT Main Gate",
    pickupTime: "12:00 PM - 2:00 PM",
    minPrice: 350,
    description: "Slow cooked overnight with premium basmati rice."
  };

  const filteredOrders = userOrders.filter(o => 
    ordersTypeFilter === 'All' ? true : 
    ordersTypeFilter === 'Pre-orders' ? !!o.dropId : 
    !o.dropId
  );

  const tabs = [
    { id: 'Orders', label: 'My Orders', icon: History },
    { id: 'Following', label: 'Following', icon: Users },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Profile', label: 'Profile Settings', icon: User }
  ];

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      
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
                  </button>
                )
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
                    {['All', 'Pre-orders', 'Regular Orders'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setOrdersTypeFilter(filter as any)}
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
                              <button className="flex-1 sm:flex-none px-5 py-2 rounded-xl border border-orange-500 text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-colors">
                                Rate Creator
                              </button>
                            ) : (
                              <button className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-stone-900 text-white text-sm font-bold hover:bg-stone-800 transition-colors shadow-sm">
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

            {/* Following Tab */}
            {activeTab === 'Following' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-stone-900 mb-1">Creators You Follow</h2>
                  <p className="text-stone-500 text-sm">You'll get notified when they announce new drops.</p>
                </div>

                {mockActiveDropFromFollowed && (
                  <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                    <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
                      <span className="text-orange-500">⚡</span> Active drops from your creators
                    </h3>
                    <div className="max-w-[320px]">
                      <DropCard {...(mockActiveDropFromFollowed as any)} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockFollowedCreators.map(creator => (
                    <div key={creator.id} className="relative group">
                      <CreatorCard {...creator} creatorType={creator.type} bioSnippet="" />
                      <button className="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-500 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-red-100 hover:bg-red-50 shadow-sm">
                        Unfollow
                      </button>
                    </div>
                  ))}
                </div>
                
                {mockFollowedCreators.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
                    <p className="text-stone-500 mb-4">You're not following any creators yet.</p>
                    <Button>Browse Creators</Button>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'Profile' && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-display font-bold text-stone-900">Personal Details</h2>
                  <button className="text-orange-500 font-semibold text-sm hover:underline flex items-center gap-1">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                </div>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-stone-700">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue={user?.name || ''}
                        disabled
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none disabled:opacity-70 text-stone-900 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-stone-700">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue={user?.email || ''}
                        readOnly
                        className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 outline-none text-stone-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-stone-700">Phone Number</label>
                      <input 
                        type="tel" 
                        defaultValue="+91 98765 43210"
                        disabled
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none disabled:opacity-70 text-stone-900 font-medium"
                      />
                    </div>
                    {/* Customer location data is not required for pickup-based FoodFlow */}
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'Notifications' && (
               <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
                 <Bell className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                  <p className="text-stone-500 font-medium">You're all caught up!</p>
                  <p className="text-sm text-stone-400 mt-1">We'll notify you when your favorite creators drop something new.</p>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
