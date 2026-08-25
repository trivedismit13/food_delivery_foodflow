import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { Plus, Package, CheckCircle, BarChart3, ChevronDown, Clock, ArrowRight, Star, Loader2 } from 'lucide-react';
import { useCreatorDashboard, useAutoInsights } from '@/queries/creatorAnalytics';
import { useCreatorDrops, useUpdateDropStatus, useCancelDrop } from '@/queries/drops';
import { motion } from 'framer-motion';

export default function CreatorDashboardHome() {
  const { user, creatorProfile } = useAuthStore();
  const [activeDropOrderExpanded, setActiveDropOrderExpanded] = useState(false);

  // Time based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name = user?.name?.split(' ')[0] || 'Chef';

  const { data: dashboard, isLoading: isDashboardLoading } = useCreatorDashboard('WEEK');
  const { data: insights, isLoading: isInsightsLoading } = useAutoInsights();

  const { data: drops, isLoading: isDropsLoading } = useCreatorDrops(creatorProfile?.restaurantId);
  const activeDrop = drops?.find(d => ['DRAFT', 'ANNOUNCED', 'OPEN', 'CUTOFF', 'READY'].includes(d.status));
  const { mutate: updateDropStatus, isPending: isUpdatingStatus } = useUpdateDropStatus();
  const { mutate: cancelDrop, isPending: isCancelling } = useCancelDrop();

  // Verification
  const verificationLevel = creatorProfile?.verificationLevel || 1;

  const percentFilled = activeDrop ? (activeDrop.currentOrders / activeDrop.maxOrders) * 100 : 0;
  const activeDropRevenue = activeDrop ? activeDrop.items.reduce((sum, item) => sum + (item.quantityOrdered * (item.dropPrice ?? item.price)), 0) : 0;

  const handleMarkReady = () => {
    if (activeDrop) {
      updateDropStatus({ dropId: activeDrop.dropId, status: 'READY' });
    }
  };

  const handleCancelDrop = () => {
    if (activeDrop) {
      cancelDrop(activeDrop.dropId);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* SECTION 1: Welcome + Quick Actions */}
      <section>
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-6">
          {greeting}, {name}! 👋
        </h1>

        {verificationLevel < 3 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-2 text-amber-800 font-bold mb-1">
                <span className="text-xl">⚠️</span> Complete your verification to reach more customers
              </div>
              <p className="text-amber-700 text-sm">Level {verificationLevel}/3 — Next step: Kitchen Inspection.</p>
            </div>
            <Link to="/dashboard/creator/verification" className="shrink-0 bg-white border border-amber-300 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-amber-100 transition-colors">
              Complete Verification →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/dashboard/creator/drops/new" className="bg-orange-500 text-white rounded-2xl p-5 hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20 flex flex-col justify-between h-32 group">
            <Plus className="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Create New Drop</span>
          </Link>
          <Link to="/dashboard/creator/menu" className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-warm-sm transition-all text-stone-700 flex flex-col justify-between h-32 group">
            <Package className="w-8 h-8 text-stone-400 group-hover:text-orange-500 transition-colors" />
            <span className="font-bold">Update Menu</span>
          </Link>
          <Link to={activeDrop ? `/dashboard/creator/drops/${activeDrop.dropId}` : '/dashboard/creator/drops'} className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-warm-sm transition-all text-stone-700 flex flex-col justify-between h-32 group">
            <CheckCircle className="w-8 h-8 text-stone-400 group-hover:text-orange-500 transition-colors" />
            <span className="font-bold">Mark Drop as Ready</span>
          </Link>
          <Link to="/dashboard/creator/analytics" className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-warm-sm transition-all text-stone-700 flex flex-col justify-between h-32 group">
            <BarChart3 className="w-8 h-8 text-stone-400 group-hover:text-orange-500 transition-colors" />
            <span className="font-bold">View Analytics</span>
          </Link>
        </div>
      </section>

      {/* SECTION 2: Active Drops Management Card */}
      <section>
        <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">Your Active Drops</h2>
        
        {isDropsLoading ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : activeDrop ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
                    {activeDrop.status}
                  </span>
                  <span className="text-sm font-semibold text-stone-400 flex items-center gap-1">
                    <Clock size={14} /> {new Date(`1970-01-01T${activeDrop.orderCutoffTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Cutoff
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-stone-900">{activeDrop.title}</h3>
              </div>
              
              <Link to={`/dashboard/creator/drops/${activeDrop.dropId}`} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-colors">
                Manage Drop
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Slots Filled</span>
                  <span className="text-2xl font-bold text-stone-900">{activeDrop.currentOrders} <span className="text-base text-stone-400 font-normal">/ {activeDrop.maxOrders}</span></span>
                </div>
                <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${percentFilled}%` }}
                  />
                </div>
                {percentFilled >= 100 && <p className="text-xs text-green-600 font-bold mt-2">Sold Out!</p>}
              </div>

              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 flex flex-col justify-center">
                <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Revenue Earned</span>
                <span className="text-3xl font-display font-bold text-stone-900 flex items-center gap-2">
                  ₹{activeDropRevenue} <span className="text-sm text-stone-400 font-normal mt-2">in pre-orders</span>
                </span>
              </div>
            </div>

            <div className="border border-stone-200 rounded-2xl overflow-hidden mb-8">
              <div className="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center cursor-pointer" onClick={() => setActiveDropOrderExpanded(!activeDropOrderExpanded)}>
                <h4 className="font-bold text-stone-800">Items to Prepare</h4>
                <ChevronDown className={`text-stone-400 transition-transform ${activeDropOrderExpanded ? 'rotate-180' : ''}`} />
              </div>
              {activeDropOrderExpanded && (
                <div className="p-0">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="p-4 font-semibold text-stone-500">Item Name</th>
                        <th className="p-4 font-semibold text-stone-500 text-right">Qty Ordered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeDrop.items.map((item, i) => (
                        <tr key={i} className="border-b border-stone-50 last:border-0">
                          <td className="p-4 font-medium text-stone-900">{item.name}</td>
                          <td className="p-4 font-bold text-orange-600 text-right text-lg">{item.quantityOrdered}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleMarkReady} 
                disabled={isUpdatingStatus || activeDrop.status === 'READY'}
                className="flex-1 bg-stone-900 text-white font-bold py-4 rounded-xl shadow-sm hover:bg-stone-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {activeDrop.status === 'READY' ? 'Marked as Ready' : 'Mark Drop as Ready'} <CheckCircle size={18} />
              </button>
              <button 
                onClick={handleCancelDrop} 
                disabled={isCancelling}
                className="px-6 bg-white border-2 border-stone-200 text-stone-600 font-bold py-4 rounded-xl hover:border-stone-300 transition-colors disabled:opacity-50"
              >
                Cancel Drop
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center py-16">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">No Active Drops</h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">You don't have any drops currently being prepared. Create a new drop to start taking orders.</p>
            <Link to="/dashboard/creator/drops/new" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20">
              <Plus size={20} /> Create New Drop
            </Link>
          </div>
        )}
      </section>

      {/* SECTION 3 & 4: KPIs & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-display text-xl font-bold text-stone-900">This Week's Numbers</h2>
            <Link to="/dashboard/creator/analytics" className="text-orange-500 text-sm font-semibold hover:underline flex items-center gap-1">Full Analytics <ArrowRight size={14}/></Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-sm font-semibold text-stone-500 mb-1">Orders</p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-stone-900">
                {isDashboardLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : dashboard?.totalOrders || 0}
              </motion.p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-sm font-semibold text-stone-500 mb-1">Revenue</p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-stone-900">
                {isDashboardLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `₹${dashboard?.totalRevenue?.toLocaleString() || 0}`}
              </motion.p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-sm font-semibold text-stone-500 mb-1">Total Followers</p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-stone-900">
                {isDashboardLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : dashboard?.followerCount || 0}
              </motion.p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-sm font-semibold text-stone-500 mb-1">Repeat Customers</p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-stone-900 flex items-center gap-1">
                {isDashboardLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${Math.round(dashboard?.repeatCustomerRate || 0)}%`}
              </motion.p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-stone-900 mb-4 opacity-0">Insights</h2>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-3xl border border-orange-100/50 h-[calc(100%-2rem)] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 text-4xl opacity-20">🤖</div>
            <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              Today's Insight
            </h3>
            {isInsightsLoading ? (
              <div className="flex items-center gap-2 text-orange-800">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your data...
              </div>
            ) : insights && insights.length > 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-800 leading-relaxed font-medium">
                {insights[0].insight}
              </motion.p>
            ) : (
              <p className="text-orange-800 leading-relaxed font-medium">
                No insights available right now. Keep completing orders to generate AI insights!
              </p>
            )}
            <div className="mt-4">
              <Link to="/dashboard/creator/analytics" className="inline-flex text-orange-600 text-sm font-bold hover:underline items-center gap-1">
                Ask a question <ArrowRight size={14}/>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
