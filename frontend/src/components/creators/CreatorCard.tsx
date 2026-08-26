import { Link } from 'react-router-dom';
import { VerificationBadge } from './VerificationBadge';

interface CreatorCardProps {
  id: number;
  name: string;
  creatorType: string;
  bioSnippet: string;
  followerCount: number;
  totalOrders: number;
  verificationLevel: 0 | 1 | 2 | 3;
  hasActiveDrop: boolean;
  imageUrl?: string;
  topCategories?: string[];
}

export function CreatorCard({
  id, name, creatorType, bioSnippet, followerCount, 
  totalOrders, verificationLevel, hasActiveDrop, imageUrl, topCategories
}: CreatorCardProps) {
  
  return (
    <Link 
      to={`/creators/${id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 border border-stone-100"
    >
      {/* Image Area */}
      <div className="h-[180px] relative w-full bg-gradient-to-br from-orange-100 to-amber-50">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-orange-200 text-5xl">🧑‍🍳</div>
        )}
        
        {/* Active Drop Badge */}
        {hasActiveDrop && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-50 text-green-700 shadow-sm flex items-center gap-1.5 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Drop Open Now!
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-stone-800 truncate">
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-orange-50 text-orange-600 text-xs rounded-full px-2 py-0.5 font-medium">
                {creatorType}
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-2 line-clamp-2 min-h-[40px]">
              {bioSnippet}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <VerificationBadge level={verificationLevel} size="sm" />
          <span className="text-xs text-stone-400 font-medium">👥 {followerCount} followers</span>
        </div>
        
        <div className="mt-2.5 pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400 font-medium">🎯 {totalOrders} orders completed</span>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <div className="flex gap-1.5 overflow-hidden flex-1 pr-2">
            {topCategories?.map(cat => (
              <span key={cat} className="inline-block px-2 py-0.5 bg-stone-50 text-stone-500 text-[10px] font-medium rounded truncate">
                {cat}
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold text-orange-500 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
            View Profile & Drops →
          </span>
        </div>
      </div>
    </Link>
  );
}
