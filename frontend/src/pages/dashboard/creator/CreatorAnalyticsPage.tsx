import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Star, TrendingUp, TrendingDown, Users, Package, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreatorDashboard, useDropPerformance, useBestDay, useCreatorRepeatCustomers, useAskInsight } from '@/queries/creatorAnalytics';
import { motion } from 'framer-motion';

export default function CreatorAnalyticsPage() {
  const [insightQuery, setInsightQuery] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightResponse, setInsightResponse] = useState<string | null>(null);

  const { data: dashboard, isLoading: isDashboardLoading } = useCreatorDashboard('WEEK');
  const { data: dropPerformanceData } = useDropPerformance(0, 5);
  const { data: bestDayDataAPI } = useBestDay();
  const { data: repeatCustomersAPI } = useCreatorRepeatCustomers();
  
  const { mutate: askInsight } = useAskInsight();

  // MOCK DATA for remaining non-API sections
  const bestDayData = [
    { day: 'Mon', fillRate: 45 },
    { day: 'Tue', fillRate: 50 },
    { day: 'Wed', fillRate: 55 },
    { day: 'Thu', fillRate: 60 },
    { day: 'Fri', fillRate: 85 },
    { day: 'Sat', fillRate: 95 },
    { day: 'Sun', fillRate: 98 },
  ];

  const repeatCustomersData = repeatCustomersAPI ? [
    { name: 'Repeat', value: repeatCustomersAPI.repeatCustomers, color: '#f97316' },
    { name: 'One-time', value: repeatCustomersAPI.totalCustomers - repeatCustomersAPI.repeatCustomers, color: '#e7e5e4' },
  ] : [
    { name: 'Repeat', value: 65, color: '#f97316' },
    { name: 'One-time', value: 35, color: '#e7e5e4' },
  ];

  const scatterData = [
    { name: "Mutton Biryani", frequency: 85, margin: 150, category: 'STAR' },
    { name: "Double Ka Meetha", frequency: 40, margin: 80, category: 'WORKHORSE' },
    { name: "Chicken 65", frequency: 30, margin: 120, category: 'HIDDEN GEM' },
    { name: "Veg Pulao", frequency: 15, margin: 40, category: 'REVIEW' },
  ];

  const handleAskInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightQuery.trim()) return;
    
    setInsightLoading(true);
    askInsight(insightQuery, {
      onSuccess: (data) => {
        setInsightResponse(data.insight);
        setInsightLoading(false);
      },
      onError: () => {
        setInsightResponse("Sorry, there was an error generating your insight.");
        setInsightLoading(false);
      }
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Analytics</h1>
        <p className="text-stone-500">Understand your performance and grow your business.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
          <p className="text-sm font-semibold text-stone-500 mb-1 flex items-center justify-between">Total Revenue <TrendingUp size={16} className="text-green-500"/></p>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-stone-900">
            {isDashboardLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `₹${dashboard?.totalRevenue?.toLocaleString() || 0}`}
          </motion.p>
          <p className="text-xs text-stone-400 mt-1">Overall</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
          <p className="text-sm font-semibold text-stone-500 mb-1 flex items-center justify-between">Total Orders <Package size={16} className="text-stone-400"/></p>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-stone-900">
            {isDashboardLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : dashboard?.totalOrders || 0}
          </motion.p>
          <p className="text-xs text-stone-400 mt-1">Across {dashboard?.totalDrops || 0} drops</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
          <p className="text-sm font-semibold text-stone-500 mb-1 flex items-center justify-between">Followers <Users size={16} className="text-orange-500"/></p>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-stone-900">
            {isDashboardLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : dashboard?.followerCount || 0}
          </motion.p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
          <p className="text-sm font-semibold text-stone-500 mb-1 flex items-center justify-between">Avg Fill Rate <Star size={16} className="text-amber-500 fill-amber-500"/></p>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-stone-900">
            {isDashboardLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${dashboard?.avgDropFillRate?.toFixed(1) || 0}%`}
          </motion.p>
        </div>
      </div>

      {/* TWO COLUMNS: Best Day & Repeat Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Best Day Analysis */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm">
          <h2 className="font-display text-xl font-bold text-stone-900 mb-6">Best Day Analysis</h2>
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestDayData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                <Tooltip cursor={{ fill: '#f5f5f4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="fillRate" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <p className="text-sm text-orange-900 font-medium">
              {bestDayDataAPI ? (
                <>Your drops perform best on <span className="font-bold">{bestDayDataAPI.dayOfWeek}s</span> with <span className="font-bold">{bestDayDataAPI.avgFillRate.toFixed(1)}% average fill rate</span>. Consider scheduling your next drop for a {bestDayDataAPI.dayOfWeek}.</>
              ) : (
                <>Your drops perform best on <span className="font-bold">Sundays</span> with <span className="font-bold">98% average fill rate</span>. Consider scheduling your next drop for a Sunday.</>
              )}
            </p>
          </div>
        </div>

        {/* Repeat Customer Rate */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm flex flex-col justify-between">
          <h2 className="font-display text-xl font-bold text-stone-900 mb-2">Customer Loyalty</h2>
          
          <div className="flex gap-4 mb-8">
            <div>
              <p className="text-3xl font-bold text-orange-600">
                {repeatCustomersAPI ? repeatCustomersAPI.repeatRatePercent.toFixed(0) : 65}%
              </p>
              <p className="text-xs font-semibold text-stone-500 uppercase">Repeat rate</p>
            </div>
            <div className="w-px bg-stone-200"></div>
            <div>
              <p className="text-3xl font-bold text-stone-900">
                {repeatCustomersAPI ? repeatCustomersAPI.totalCustomers : 142}
              </p>
              <p className="text-xs font-semibold text-stone-500 uppercase">Unique customers</p>
            </div>
          </div>

          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={repeatCustomersData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                  {repeatCustomersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Star className="text-orange-500 fill-orange-500 w-8 h-8 mb-1" />
            </div>
          </div>

          <p className="text-center text-sm font-medium text-stone-600 mt-4">
            Customers who've ordered multiple times: <span className="font-bold text-stone-900">{repeatCustomersAPI ? repeatCustomersAPI.repeatCustomers : 42}</span>
          </p>
        </div>

      </div>

      {/* Drop Performance Table */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-stone-100">
          <h2 className="font-display text-xl font-bold text-stone-900">How Your Drops Performed</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="p-4 pl-6 font-semibold text-stone-500">Drop Title</th>
                <th className="p-4 font-semibold text-stone-500">Date</th>
                <th className="p-4 font-semibold text-stone-500">Orders</th>
                <th className="p-4 font-semibold text-stone-500">Fill Rate</th>
                <th className="p-4 font-semibold text-stone-500">Revenue</th>
                <th className="p-4 pr-6 font-semibold text-stone-500 text-right">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {dropPerformanceData?.content.map((drop, i) => {
                const fillRate = drop.maxOrders > 0 ? (drop.currentOrders / drop.maxOrders) * 100 : 0;
                return (
                  <tr key={i} className={cn("transition-colors", fillRate === 100 ? "bg-amber-50/30" : "hover:bg-stone-50")}>
                    <td className="p-4 pl-6">
                      <p className="font-bold text-stone-900 flex items-center gap-2">
                        {drop.dropTitle} {fillRate === 100 && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">BEST</span>}
                      </p>
                    </td>
                    <td className="p-4 text-stone-500">{drop.dropDate}</td>
                    <td className="p-4 font-medium">{drop.currentOrders} / {drop.maxOrders}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 w-32">
                        <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(fillRate, 100)}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-stone-600">{fillRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-stone-900">-</td>
                    <td className="p-4 pr-6 font-semibold text-stone-900 text-right flex items-center justify-end gap-1">
                      -
                    </td>
                  </tr>
                );
              })}
              {(!dropPerformanceData || dropPerformanceData.content.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-stone-500">No drop performance data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Menu Intelligence (Scatter Chart) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm">
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold text-stone-900">Menu Intelligence</h2>
          <p className="text-sm text-stone-500">Identify which dishes drive your business based on order frequency and profit margin.</p>
        </div>
        
        <div className="h-80 w-full relative mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="frequency" name="Order Frequency" stroke="#d6d3d1" tick={{ fill: '#78716c', fontSize: 12 }} />
              <YAxis type="number" dataKey="margin" name="Margin (₹)" stroke="#d6d3d1" tick={{ fill: '#78716c', fontSize: 12 }} />
              <ZAxis type="category" dataKey="name" name="Item" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '12px' }}
                itemStyle={{ color: '#1c1917', fontWeight: 600 }}
              />
              <Scatter data={scatterData} fill="#f97316">
                {scatterData.map((entry, index) => {
                  let color = '#f97316'; // orange default
                  if (entry.category === 'STAR') color = '#22c55e'; // green
                  if (entry.category === 'HIDDEN GEM') color = '#3b82f6'; // blue
                  if (entry.category === 'WORKHORSE') color = '#f59e0b'; // amber
                  if (entry.category === 'REVIEW') color = '#ef4444'; // red
                  
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Quadrant Lines (visual guides) */}
          <div className="absolute inset-x-12 top-1/2 h-px bg-stone-200 border-t border-dashed pointer-events-none"></div>
          <div className="absolute inset-y-8 left-1/2 w-px bg-stone-200 border-l border-dashed pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-3 rounded-xl border border-green-100 cursor-help">
            <h4 className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wider">Star</h4>
            <p className="text-xs text-green-600">High orders, high margin. (e.g. Mutton Biryani)</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 cursor-help">
            <h4 className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wider">Hidden Gem</h4>
            <p className="text-xs text-blue-600">Low orders, high margin. Promote these!</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 cursor-help">
            <h4 className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wider">Workhorse</h4>
            <p className="text-xs text-amber-600">High orders, low margin. (e.g. Desserts)</p>
          </div>
          <div className="bg-red-50 p-3 rounded-xl border border-red-100 cursor-help">
            <h4 className="text-xs font-bold text-red-700 mb-1 uppercase tracking-wider">Review</h4>
            <p className="text-xs text-red-600">Low orders, low margin. Consider removing.</p>
          </div>
        </div>
      </div>

      {/* AI Insight Chat Panel */}
      <div className="bg-gradient-to-tr from-stone-900 to-stone-800 rounded-3xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm border border-white/20 shrink-0">
            🤖
          </div>
          
          <div className="flex-1 w-full">
            <h3 className="font-display text-2xl font-bold mb-2">Ask FoodFlow AI</h3>
            <p className="text-stone-400 text-sm mb-6 max-w-lg">
              Our AI analyzes your drop history, customer reviews, and market trends to give you actionable insights.
            </p>

            <form onSubmit={handleAskInsight} className="flex gap-2 mb-6">
              <input
                type="text"
                value={insightQuery}
                onChange={(e) => setInsightQuery(e.target.value)}
                placeholder="e.g., When is the best time to schedule dessert drops?"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 placeholder-stone-500 text-sm"
              />
              <button 
                type="submit" 
                disabled={insightLoading || !insightQuery.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-stone-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shrink-0"
              >
                {insightLoading ? <Loader2 size={20} className="animate-spin" /> : "Ask"}
              </button>
            </form>

            {insightResponse && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <h4 className="text-sm font-bold text-orange-400 mb-1 uppercase tracking-wider">Insight</h4>
                <p className="text-stone-200 leading-relaxed text-sm whitespace-pre-wrap">
                  {insightResponse}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
