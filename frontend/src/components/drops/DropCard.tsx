import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VerificationBadge } from '../creators/VerificationBadge';
import { CountdownTimer } from './CountdownTimer';

import { cn } from '@/lib/utils';
import type { FoodDropResponse } from '@/types/api';

export type DropStatus = 'DRAFT' | 'ANNOUNCED' | 'OPEN' | 'CUTOFF' | 'READY' | 'COMPLETED' | 'CANCELLED';

export function DropCard(drop: FoodDropResponse) {
  const {
    dropId, title, creator, dropPhotoUrl, status, maxOrders, currentOrders, 
    orderCutoffTime, dropDate, pickupStartTime, pickupEndTime, 
    description, items, isSoldOut: apiIsSoldOut
  } = drop;
  
  const percentFilled = Math.min((currentOrders / maxOrders) * 100, 100);
  const isSoldOut = currentOrders >= maxOrders || apiIsSoldOut;
  const isUrgent = percentFilled > 80;
  
  const minPrice = items && items.length > 0 ? Math.min(...items.map(i => i.dropPrice || i.price)) : 0;

  const renderStatusBadge = () => {
    switch(status) {
      case 'OPEN':
        if (isSoldOut) return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-stone-500 text-white shadow-sm">Sold Out</span>;
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-500 text-white shadow-sm">🟢 Accepting Orders</span>;
      case 'ANNOUNCED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-500 text-white shadow-sm">📢 Coming Soon</span>;
      case 'CUTOFF':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500 text-white shadow-sm">🍳 Cooking Now</span>;
      case 'READY':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-500 text-white shadow-sm">🛍️ Ready for Pickup</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-stone-800 text-white shadow-sm">✅ Completed</span>;
      default:
        return null;
    }
  };

  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const tmrw = new Date(today);
    tmrw.setDate(tmrw.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tmrw.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-IN', { weekday: 'long' });
  };

  return (
    <Link 
      to={`/drops/${dropId}`}
      className="group block h-full bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 hover:border-orange-200"
    >
      {/* Image Header */}
      <div className="relative h-48 bg-stone-100 overflow-hidden shrink-0">
        {dropPhotoUrl ? (
          <img 
            src={dropPhotoUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-50 group-hover:bg-stone-100 transition-colors">
            <span className="text-4xl">🍲</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          {renderStatusBadge()}
        </div>

        {isUrgent && !isSoldOut && status === 'OPEN' && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1.5 shadow-sm text-xs font-bold text-orange-600">
            🔥 Selling Fast
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-bold text-lg text-stone-900 leading-tight group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          <div className="flex flex-col items-end shrink-0 ml-3">
            <span className="text-xs text-stone-500 font-medium mb-0.5">from</span>
            <span className="font-bold text-stone-900">₹{minPrice}</span>
          </div>
        </div>

        <Link 
          to={`/creators/${creator?.restaurantId}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 mb-4 hover:bg-stone-50 px-1 -ml-1 rounded transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-700 overflow-hidden shrink-0">
            {creator?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-stone-600 truncate">{creator?.name}</span>
          <VerificationBadge level={creator?.verificationLevel || 1} size="sm" />
        </Link>

        <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-1">
          {description}
        </p>

        <div className="space-y-3 mt-auto">
          {/* Progress Bar for open drops */}
          {(status === 'OPEN' || status === 'ANNOUNCED') && (
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-stone-500">{currentOrders} ordered</span>
                <span className={isSoldOut ? "text-red-500 font-bold" : "text-stone-700"}>
                  {isSoldOut ? 'Sold Out' : `${maxOrders - currentOrders} left`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentFilled}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${isUrgent ? 'bg-red-400' : 'bg-orange-500'}`}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-1.5 text-stone-600 bg-stone-50 px-2 py-1 rounded-md">
                📅 <span className="text-stone-900">{getDayLabel(dropDate)}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-stone-600 bg-stone-50 px-2 py-1 rounded-md">
                🕒 <span className="text-stone-900">
                  {pickupStartTime ? new Date(pickupStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                </span>
              </div>
            </div>
            
            <div className="mt-2 mb-1">
              {status === 'OPEN' && !isSoldOut ? (
                <CountdownTimer cutoffTime={orderCutoffTime} size="sm" />
              ) : (
                <span className="text-xs text-stone-400 font-medium">Ordering closed</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
