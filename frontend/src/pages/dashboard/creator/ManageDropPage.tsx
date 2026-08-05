import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, Clock, AlertTriangle, Play, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropStatus } from '@/components/drops/DropCard';

import { useDropById, useUpdateDropStatus, useDropOrders } from '@/queries/drops';

type Tab = 'Details' | 'Orders';

export default function ManageDropPage() {
  const { dropId } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('Orders');
  
  const { data: drop, isLoading: isLoadingDrop } = useDropById(Number(dropId));
  const { data: orders = [], isLoading: isLoadingOrders } = useDropOrders(Number(dropId));
  const updateStatusMutation = useUpdateDropStatus();

  const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const itemsToPrepareMap: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      itemsToPrepareMap[item.itemName] = (itemsToPrepareMap[item.itemName] || 0) + item.quantity;
    });
  });
  const itemsToPrepare = Object.entries(itemsToPrepareMap).map(([name, qty]) => ({ name, qty }));

  const handleStatusChange = () => {
    if (!drop) return;
    let newStatus = '';
    
    if (drop.status === 'DRAFT') newStatus = 'ANNOUNCED';
    else if (drop.status === 'ANNOUNCED') newStatus = 'OPEN';
    else if (drop.status === 'OPEN') newStatus = 'CUTOFF';
    else if (drop.status === 'CUTOFF') newStatus = 'READY';
    else if (drop.status === 'READY') newStatus = 'COMPLETED';

    if (newStatus) {
      updateStatusMutation.mutate({ dropId: Number(dropId), status: newStatus });
    }
  };

  if (isLoadingDrop) return <div className="p-8 text-center">Loading drop details...</div>;
  if (!drop) return <div className="p-8 text-center text-red-500">Drop not found.</div>;


  const getStatusColor = (status: DropStatus) => {
    switch(status) {
      case 'OPEN': return 'bg-green-100 text-green-800 border-green-200';
      case 'ANNOUNCED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CUTOFF': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'READY': return 'bg-green-500 text-white animate-pulse';
      case 'COMPLETED': return 'bg-stone-200 text-stone-800 border-stone-300';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'DRAFT': return 'bg-stone-100 text-stone-600 border-stone-200';
      default: return 'bg-stone-100';
    }
  };

  const isPreparing = drop.status === 'CUTOFF' || drop.status === 'READY';
  
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <Link to="/dashboard/creator/drops" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-orange-500 transition-colors mb-4">
          <ArrowLeft size={16} /> All Drops
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">{drop.title}</h1>
            <div className="flex items-center gap-3">
              <span className={cn("px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border", getStatusColor(drop.status as DropStatus))}>
                {drop.status}
              </span>
              <span className="text-stone-500 text-sm">ID: {dropId || "1"}</span>
            </div>
          </div>
          
          {drop.status !== 'COMPLETED' && drop.status !== 'CANCELLED' && (
            <button 
              onClick={handleStatusChange}
              className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {drop.status === 'DRAFT' && <><CheckSquare size={18} /> Publish Drop</>}
              {drop.status === 'ANNOUNCED' && <><Play size={18} /> Open for Orders</>}
              {drop.status === 'OPEN' && <><Clock size={18} /> Close Orders</>}
              {drop.status === 'CUTOFF' && <><CheckCircle size={18} /> Mark as Ready</>}
              {drop.status === 'READY' && <><CheckCircle size={18} /> Complete Drop</>}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 w-full order-2 lg:order-1">
          {/* Tabs */}
          <div className="flex gap-2 pb-2 border-b border-stone-200 mb-6">
            {(['Orders', 'Details'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-t-xl text-sm font-semibold transition-colors border-b-2",
                  activeTab === tab 
                    ? "border-orange-500 text-orange-600 bg-orange-50/50" 
                    : "border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Orders' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-stone-900">{drop.currentOrders}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">₹{revenue}</p>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
                <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <CheckSquare size={18} /> Prepare the following:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {itemsToPrepare.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-orange-100">
                      <span className="font-medium text-stone-800">{item.name}</span>
                      <span className="font-bold text-orange-600 text-xl">{item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                  <h3 className="font-bold text-stone-900">Customer Orders</h3>
                  <button className="flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm">
                    <Download size={16} /> Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200">
                        <th className="p-4 font-semibold text-stone-500">Order ID</th>
                        <th className="p-4 font-semibold text-stone-500">Customer</th>
                        <th className="p-4 font-semibold text-stone-500">Items</th>
                        <th className="p-4 font-semibold text-stone-500">Collection</th>
                        <th className="p-4 font-semibold text-stone-500 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map((order, i) => (
                        <tr key={order.orderId} className="hover:bg-stone-50 transition-colors">
                          <td className="p-4 font-medium text-stone-900">FF-{order.orderId}</td>
                          <td className="p-4">
                            <p className="font-bold text-stone-900">User {order.userId}</p>
                            <p className="text-xs text-stone-500">View details</p>
                          </td>
                          <td className="p-4 text-stone-600">
                            {order.items.map(item => `${item.quantity}x ${item.itemName}`).join(', ')}
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-1 text-xs font-semibold rounded bg-stone-100 text-stone-700"
                            )}>
                              {drop.pickupStartTime ? new Date(drop.pickupStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Pickup'}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-stone-900 text-right">₹{order.totalAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'Details' && (
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center">
              <p className="text-stone-500">The edit form goes here (same layout as CreateDropPage).</p>
            </div>
          )}

        </div>

        {/* Right Side: Status Management Panel */}
        <div className="w-full lg:w-80 shrink-0 order-1 lg:order-2">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden sticky top-24">
            <div className="p-5 border-b border-stone-100 bg-stone-50">
              <h3 className="font-semibold text-stone-800 uppercase tracking-wider text-xs">Status Management</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="text-center">
                <p className="text-xs text-stone-500 mb-2">Current Status</p>
                <div className={cn("inline-flex items-center justify-center w-full py-4 text-lg font-bold rounded-xl border-2 uppercase tracking-wider", getStatusColor(drop.status as DropStatus))}>
                  {drop.status}
                </div>
              </div>

              <div className="border-t border-stone-100 pt-6">
                <p className="text-xs text-stone-500 mb-3 text-center">Next Action</p>
                
                {drop.status === 'DRAFT' && (
                  <button onClick={handleStatusChange} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition flex justify-center gap-2 items-center">
                    Publish Drop <Play size={16}/>
                  </button>
                )}
                {drop.status === 'ANNOUNCED' && (
                  <button onClick={handleStatusChange} className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition flex justify-center gap-2 items-center">
                    Open for Orders <Play size={16}/>
                  </button>
                )}
                {drop.status === 'OPEN' && (
                  <button onClick={handleStatusChange} className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition flex justify-center gap-2 items-center">
                    Close Order Window <Clock size={16}/>
                  </button>
                )}
                {drop.status === 'CUTOFF' && (
                  <button onClick={handleStatusChange} className="w-full bg-stone-900 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 hover:bg-stone-800 transition flex justify-center gap-2 items-center">
                    Mark Food as Ready <CheckCircle size={16}/>
                  </button>
                )}
                {drop.status === 'READY' && (
                  <button onClick={handleStatusChange} className="w-full bg-stone-200 text-stone-800 font-bold py-3 rounded-xl hover:bg-stone-300 transition flex justify-center gap-2 items-center">
                    Mark as Completed
                  </button>
                )}
                {drop.status === 'COMPLETED' && (
                  <p className="text-sm font-semibold text-green-600 text-center bg-green-50 py-2 rounded-lg">Drop finished successfully!</p>
                )}
              </div>

            </div>

            {(drop.status === 'DRAFT' || drop.status === 'ANNOUNCED') && (
              <div className="p-4 bg-red-50 border-t border-red-100">
                <button className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold text-sm hover:underline">
                  <AlertTriangle size={16} /> Cancel this drop
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
