import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ChefHat, Star, ArrowRight, ActivitySquare } from 'lucide-react';
import { useCreators } from '@/queries/creators';
import { CreatorSummary } from '@/types/api';
import { cn } from '@/lib/utils';

export default function CreatorsListPage() {
  const [city, setCity] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [creatorType, setCreatorType] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useCreators({
    city,
    creatorType,
    page,
    size: 20
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[60vh] flex flex-col">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-stone-900 mb-3">Food Creators</h1>
        <p className="text-stone-500 text-lg">Discover verified home chefs and independent creators.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 mb-8 flex flex-wrap gap-4 items-end shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="e.g. Vellore"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              value={city}
              onChange={(e) => { setCity(e.target.value); setPage(0); }}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Cuisine</label>
          <div className="relative">
            <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="e.g. Biryani"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              value={cuisine}
              onChange={(e) => { setCuisine(e.target.value); setPage(0); }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Creator Type</label>
          <select 
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none"
            value={creatorType}
            onChange={(e) => { setCreatorType(e.target.value); setPage(0); }}
          >
            <option value="">All Types</option>
            <option value="HOME BAKER">Home Baker</option>
            <option value="TIFFIN SERVICE">Tiffin Service</option>
            <option value="CAMPUS SELLER">Campus Seller</option>
            <option value="CLOUD KITCHEN">Cloud Kitchen</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="bg-white rounded-2xl h-[280px] border border-stone-100 animate-pulse"></div>
           ))}
        </div>
      ) : data?.content.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 mb-6">
            <Search size={32} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">No creators found</h2>
          <p className="text-stone-500 max-w-md mx-auto mb-8">
            Try adjusting your filters to discover more food creators in your area.
          </p>
          <button 
            onClick={() => { setCity(''); setCuisine(''); setCreatorType(''); }}
            className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.content.map((creator) => (
              <CreatorCard key={creator.restaurantId} creator={creator} />
            ))}
          </div>
          
          {/* Pagination */}
          {data && data.totalPages > 1 && (
             <div className="mt-12 flex justify-center gap-2">
               <button 
                 disabled={data.first}
                 onClick={() => setPage(p => Math.max(0, p - 1))}
                 className="px-4 py-2 border border-stone-200 rounded-lg bg-white disabled:opacity-50"
               >
                 Previous
               </button>
               <div className="px-4 py-2 font-medium text-stone-600">
                 Page {data.number + 1} of {data.totalPages}
               </div>
               <button 
                 disabled={data.last}
                 onClick={() => setPage(p => p + 1)}
                 className="px-4 py-2 border border-stone-200 rounded-lg bg-white disabled:opacity-50"
               >
                 Next
               </button>
             </div>
          )}
        </>
      )}
    </div>
  );
}

function CreatorCard({ creator }: { creator: CreatorSummary }) {
  return (
    <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      
      {/* Decorative header */}
      <div className="h-24 bg-gradient-to-br from-orange-100 to-rose-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
        {creator.activeDrop && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md shadow-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Drop Open Now!
          </div>
        )}
      </div>
      
      <div className="px-6 pb-6 pt-0 flex-1 flex flex-col relative">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-stone-100 flex items-center justify-center text-xl font-bold text-orange-600 -mt-8 mb-4 relative z-10">
          {creator.name.charAt(0)}
        </div>
        
        <h3 className="font-display font-bold text-xl text-stone-900 mb-1">{creator.name}</h3>
        
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-stone-500 border-stone-200 bg-stone-50">
            {creator.creatorType.replace('_', ' ')}
          </span>
          {creator.verificationLevel > 0 && (
             <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-blue-600 border-blue-200 bg-blue-50">
               L{creator.verificationLevel} Verified
             </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <div className="text-stone-400 font-medium text-xs mb-1">Rating</div>
            <div className="flex items-center gap-1 font-semibold text-stone-800">
               <Star size={14} className="fill-orange-400 text-orange-400" />
               {creator.avgRating.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-stone-400 font-medium text-xs mb-1">Followers</div>
            <div className="font-semibold text-stone-800">{creator.followerCount}</div>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-stone-100">
          <Link 
            to={`/creators/${creator.restaurantId}`}
            className="flex items-center justify-between w-full font-bold text-orange-600 hover:text-orange-700 transition-colors group-hover:translate-x-1"
          >
            View Profile
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
