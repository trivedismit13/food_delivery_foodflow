import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Star, TrendingUp, TrendingDown, Users, Package, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useCreatorDashboard, 
  useDropPerformance, 
  useBestDay, 
  useCreatorRepeatCustomers, 
  useAskInsight,
  useCreatorWeeklyTrend,
  useCreatorTopItems,
  useAutoInsights
} from '@/queries/creatorAnalytics';
import { motion } from 'framer-motion';

export default function CreatorAnalyticsPage() {
  const [period, setPeriod] = useState('LAST_30_DAYS');
  const [insightQuery, setInsightQuery] = useState('');
  const [insightResponse, setInsightResponse] = useState<string | null>(null);

  const { data: dashboard, isLoading: isDashboardLoading, isError: isDashboardError } = useCreatorDashboard(period);
  const { data: dropPerformanceData, isLoading: isDropsLoading } = useDropPerformance(0, 5);
  const { data: bestDayDataAPI, isLoading: isBestDayLoading } = useBestDay();
  const { data: repeatCustomersAPI, isLoading: isRepeatLoading } = useCreatorRepeatCustomers();
  const { data: weeklyTrendData, isLoading: isTrendLoading } = useCreatorWeeklyTrend(12);
  const { data: topItemsData, isLoading: isTopItemsLoading } = useCreatorTopItems(0, 20);
  const { data: autoInsights, isLoading: isAutoInsightsLoading } = useAutoInsights();
  
  const { mutate: askInsight, isPending: isAskInsightPending } = useAskInsight();

  const trendChartData = weeklyTrendData ? [...weeklyTrendData].reverse().map(trend => ({
    week: trend.week,
    revenue: trend.revenue,
    orders: trend.orders
  })) : [];

  const repeatCustomersData = repeatCustomersAPI ? [
    { name: 'Repeat', value: repeatCustomersAPI.repeatCustomers, color: '#f97316' },
    { name: 'One-time', value: repeatCustomersAPI.totalCustomers - repeatCustomersAPI.repeatCustomers, color: '#e7e5e4' },
  ] : [];

  const scatterData = topItemsData?.content.map(item => {
    const avgValue = item.totalOrders > 0 ? item.totalRevenue / item.totalOrders : 0;
    let category = 'STAR';
    if (item.totalOrders > 5 && avgValue > 150) category = 'STAR';
    else if (item.totalOrders <= 5 && avgValue > 150) category = 'HIDDEN GEM';
    else if (item.totalOrders > 5 && avgValue <= 150) category = 'WORKHORSE';
    else category = 'REVIEW';
    
    return {
      name: item.itemName,
      frequency: item.totalOrders,
      margin: avgValue,
      totalRevenue: item.totalRevenue,
      category
    };
  }) || [];

  const handleAskInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightQuery.trim() || isAskInsightPending) return;
    
    askInsight(insightQuery, {
      onSuccess: (data) => {
        setInsightResponse(data.insight);
      },
      onError: () => {
        setInsightResponse("Sorry, there was an error generating your insight.");
      }
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Analytics</h1>
          <p className="text-stone-500">Understand your performance and grow your business.</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-stone-500" />
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2"
          >
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
          </select>
        </div>
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
        
        {/* Weekly Trend & Best Day */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm flex flex-col">
          <h2 className="font-display text-xl font-bold text-stone-900 mb-6">Revenue Trend (12 Weeks)</h2>
          <div className="h-48 mb-6 flex-1">
            {isTrendLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendChartData}>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                  <Tooltip cursor={{ fill: '#f5f5f4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-auto">
            <p className="text-sm text-orange-900 font-medium">
              {isBestDayLoading ? (
                <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
              ) : bestDayDataAPI ? (
                <>Your drops perform best on <span className="font-bold">{bestDayDataAPI.dayOfWeek}s</span> with <span className="font-bold">{bestDayDataAPI.avgFillRate.toFixed(1)}% average fill rate</span>. Consider scheduling your next drop for a {bestDayDataAPI.dayOfWeek}.</>
              ) : (
                <>Not enough data to determine your best performing day yet.</>
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
                {isRepeatLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `${repeatCustomersAPI?.repeatRatePercent.toFixed(0) || 0}%`}
              </p>
              <p className="text-xs font-semibold text-stone-500 uppercase">Repeat rate</p>
            </div>
            <div className="w-px bg-stone-200"></div>
            <div>
              <p className="text-3xl font-bold text-stone-900">
                {isRepeatLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : repeatCustomersAPI?.totalCustomers || 0}
              </p>
              <p className="text-xs font-semibold text-stone-500 uppercase">Unique customers</p>
            </div>
          </div>

          <div className="h-48 relative flex items-center justify-center">
            {isRepeatLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
            ) : repeatCustomersData.length > 0 ? (
              <>
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
              </>
            ) : (
               <div className="text-stone-400 text-sm">No customer data</div>
            )}
          </div>

          <p className="text-center text-sm font-medium text-stone-600 mt-4">
            Customers who've ordered multiple times: <span className="font-bold text-stone-900">{isRepeatLoading ? '-' : repeatCustomersAPI?.repeatCustomers || 0}</span>
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
              {isDropsLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading drop performance...
                  </td>
                </tr>
              ) : dropPerformanceData?.content.map((drop, i) => {
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
              {(!isDropsLoading && (!dropPerformanceData || dropPerformanceData.content.length === 0)) && (
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
          {isTopItemsLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
            </div>
          ) : scatterData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-stone-500">
              No item data available.
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis type="number" dataKey="frequency" name="Order Frequency" stroke="#d6d3d1" tick={{ fill: '#78716c', fontSize: 12 }} />
                  <YAxis type="number" dataKey="margin" name="Avg Value (₹)" stroke="#d6d3d1" tick={{ fill: '#78716c', fontSize: 12 }} />
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
            </>
          )}
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

      {/* Auto Insights Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm">
        <div className="mb-6">
          <h2 className="font-display text-xl font-bold text-stone-900 flex items-center gap-2">
            <Star className="text-orange-500 fill-orange-500 w-5 h-5" /> 
            AI Insights
          </h2>
          <p className="text-sm text-stone-500">Automatically generated insights based on your recent activity.</p>
        </div>
        
        {isAutoInsightsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : autoInsights && autoInsights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {autoInsights.map((insight, index) => (
              <div key={index} className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <h3 className="font-bold text-orange-900 mb-2">{insight.question}</h3>
                <p className="text-sm text-orange-800 leading-relaxed">{insight.insight}</p>
                {insight.confidence > 0 && (
                  <div className="mt-3 text-xs font-semibold text-orange-600/70 uppercase tracking-wider">
                    Confidence: {(insight.confidence * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
            No insights available yet. Keep growing your business to generate insights!
          </div>
        )}
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
                disabled={isAskInsightPending || !insightQuery.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-stone-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shrink-0"
              >
                {isAskInsightPending ? <Loader2 size={20} className="animate-spin" /> : "Ask"}
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
