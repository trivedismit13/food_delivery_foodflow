import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropStatus } from '@/components/drops/DropCard';
import { useAuthStore } from '@/store/authStore';
import { useCreatorDrops } from '@/queries/drops';

type TabType = 'All' | 'Draft' | 'Open' | 'Cutoff' | 'Completed' | 'Cancelled';

export default function CreatorDropsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const { creatorProfile } = useAuthStore();

  const { data: drops = [], isLoading, isError } = useCreatorDrops(creatorProfile?.restaurantId);

  const normalizedDrops = useMemo(() =>
    drops.map((drop) => ({
      id: drop.dropId,
      title: drop.title,
      status: drop.status as DropStatus,
      date: formatDropDate(drop.dropDate),
      maxOrders: drop.maxOrders,
      currentOrders: drop.currentOrders,
      revenue: drop.items ? drop.items.reduce((sum, item) => sum + (item.quantityOrdered * (item.dropPrice ?? item.price)), 0) : 0,
      recentOrders: [] as Array<{ id: string; name: string; items: string }>,
    })),
    [drops]
  );

  const filteredDrops = normalizedDrops.filter((drop) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Draft') return drop.status === 'DRAFT';
    if (activeTab === 'Open') return drop.status === 'OPEN' || drop.status === 'ANNOUNCED';
    if (activeTab === 'Cutoff') return drop.status === 'CUTOFF' || drop.status === 'READY';
    if (activeTab === 'Completed') return drop.status === 'COMPLETED';
    if (activeTab === 'Cancelled') return drop.status === 'CANCELLED';
    return true;
  });

  const getStatusColor = (status: DropStatus) => {
    switch(status) {
      case 'OPEN': return 'bg-green-500';
      case 'ANNOUNCED': return 'bg-blue-500';
      case 'CUTOFF': return 'bg-amber-500';
      case 'READY': return 'bg-green-400 animate-pulse';
      case 'COMPLETED': return 'bg-stone-500';
      case 'CANCELLED': return 'bg-red-500';
      case 'DRAFT': return 'bg-stone-300';
      default: return 'bg-stone-300';
    }
  };

  const getStatusLabel = (status: DropStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatDropDate = (date: string | null | undefined) => {
    if (!date) return 'TBD';
    try {
      return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };

  if (!creatorProfile?.restaurantId) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-500">
          Your creator profile is still loading. Please refresh and try again.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-500">
          Loading your drops...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
          We couldn’t load your drops right now. Please try again in a moment.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-display text-3xl font-bold text-stone-900">Your Drops</h1>
        <Link 
          to="/dashboard/creator/drops/new" 
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> New Drop
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 border-b border-stone-200">
        {(['All', 'Draft', 'Open', 'Cutoff', 'Completed', 'Cancelled'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 rounded-t-xl text-sm font-semibold transition-colors whitespace-nowrap border-b-2",
              activeTab === tab 
                ? "border-orange-500 text-orange-600 bg-orange-50/50" 
                : "border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Drop List */}
      <div className="space-y-3">
        {filteredDrops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
            <p className="text-stone-500 mb-4">
              {activeTab === 'Draft' && "Drops you've started but not published yet."}
              {activeTab === 'Open' && "No open drops. Create one to start accepting orders."}
              {activeTab === 'All' && "You haven't created any drops yet."}
              {activeTab === 'Cutoff' && "No drops are currently in preparation."}
              {activeTab === 'Completed' && "You don't have any completed drops yet."}
            </p>
            {(activeTab === 'All' || activeTab === 'Open') && (
              <Link to="/dashboard/creator/drops/new" className="text-orange-500 font-semibold hover:underline">
                + Create your first drop
              </Link>
            )}
          </div>
        ) : (
          filteredDrops.map(drop => (
            <div key={drop.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:border-orange-200 transition-colors">
              
              <div 
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === drop.id ? null : drop.id)}
              >
                {/* Left */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${getStatusColor(drop.status)}`} />
                  <div>
                    <h3 className="font-bold text-stone-900 text-lg">{drop.title}</h3>
                    <p className="text-sm text-stone-500">{drop.date}</p>
                  </div>
                </div>

                {/* Center Stats */}
                <div className="flex items-center gap-8 md:w-1/3">
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Orders</p>
                    <p className="font-bold text-stone-900">{drop.currentOrders} / {drop.maxOrders}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Revenue</p>
                    <p className="font-bold text-stone-900">₹{drop.revenue}</p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 md:w-1/4">
                  <span className={cn(
                    "px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border",
                    drop.status === 'OPEN' ? "bg-green-50 text-green-700 border-green-200" :
                    drop.status === 'DRAFT' ? "bg-stone-100 text-stone-600 border-stone-200" :
                    "bg-amber-50 text-amber-700 border-amber-200"
                  )}>
                    {getStatusLabel(drop.status)}
                  </span>
                  
                  <Link 
                    to={`/dashboard/creator/drops/${drop.id}`}
                    className="flex items-center gap-1 text-orange-500 font-semibold hover:text-orange-600 text-sm"
                    onClick={(e) => e.stopPropagation()} // Prevent row expansion when clicking link
                  >
                    Manage <ChevronRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Expandable Order List */}
              {expandedRow === drop.id && (
                <div className="bg-stone-50 border-t border-stone-100 p-5">
                  <h4 className="font-semibold text-stone-800 mb-3 text-sm flex items-center gap-2">
                    Recent Orders 
                    {drop.recentOrders.length > 0 && <span className="text-xs font-normal text-stone-500">({drop.currentOrders} total)</span>}
                  </h4>
                  
                  {drop.recentOrders.length === 0 ? (
                    <p className="text-sm text-stone-500 italic">No orders yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {drop.recentOrders.map((order, i) => (
                        <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-stone-200 p-3 rounded-lg text-sm">
                          <div>
                            <span className="font-semibold text-stone-900 mr-2">{order.name}</span>
                            <span className="text-stone-400 text-xs">{order.id}</span>
                          </div>
                          <span className="text-stone-600">{order.items}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {drop.currentOrders > 2 && (
                    <Link to={`/dashboard/creator/drops/${drop.id}?tab=orders`} className="inline-block mt-4 text-sm font-semibold text-orange-500 hover:underline">
                      View all orders →
                    </Link>
                  )}
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}
