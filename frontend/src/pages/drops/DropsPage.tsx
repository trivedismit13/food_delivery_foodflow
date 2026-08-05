import { useState } from 'react';
import { DropCard } from '@/components/drops/DropCard';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { useSearchParams } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';
import { useActiveDropsFeed, useFollowedCreatorDrops } from '@/queries/drops';
import { NoLocationBanner } from '@/components/location/NoLocationBanner';
import { LocationPrompt } from '@/components/location/LocationPrompt';
import { AnimatePresence, motion } from 'framer-motion';

const typeMapping: Record<string, string> = {
  'Baked Goods': 'HOME_BAKER',
  'Meals': 'CLOUD_KITCHEN',
  'Desserts': 'SPECIALTY_DESSERTS',
  'Tiffin': 'TIFFIN_SERVICE'
};

export default function DropsPage() {
  const { isAuthenticated } = useAuthStore();
  const [activeStatus, setActiveStatus] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [activeSort, setActiveSort] = useState('Closing Soonest');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  
  const { cityId, lat, lng, cityName } = useLocationStore();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || undefined;

  const { data: feedData, isLoading: isFeedLoading, isPlaceholderData } = useActiveDropsFeed({ 
    cityId: cityId || undefined,
    lat: lat || undefined,
    lng: lng || undefined,
    type: activeType !== 'All' ? typeMapping[activeType] : undefined,
    sortBy: activeSort === 'Closing Soonest' ? 'closingSoonest' : 'newest',
    query
  });
  const { data: followedDropsData = [] } = useFollowedCreatorDrops();

  const now = new Date();
  
  const drops = feedData?.content || [];
  
  // Derived state
  const closingSoonDrops = drops.filter(d => {
    const diff = new Date(d.orderCutoffTime).getTime() - now.getTime();
    return diff > 0 && diff < 1000 * 60 * 60 * 4 && d.status === 'OPEN';
  });

  const followedDrops = followedDropsData;

  // Backend handles 'type' filtering natively via API now.
  // We handle 'status' locally if needed, but 'All' includes both OPEN and ANNOUNCED for now.
  // Wait, backend `getActiveDropsFeed` only returns OPEN Drops by default due to FoodDropSpecification.
  // Let's filter locally for ANNOUNCED if needed, but since backend only returns OPEN, 'Coming Soon' might be empty unless we change backend.
  // The plan specified backend filters status=OPEN. So 'Coming Soon' will just be empty for now, which is fine for this activity.
  let filteredDrops = drops;
  if (activeStatus === 'Open Now') filteredDrops = filteredDrops.filter(d => d.status === 'OPEN');
  if (activeStatus === 'Coming Soon') filteredDrops = filteredDrops.filter(d => d.status === 'ANNOUNCED');

  return (
    <div className="min-h-screen bg-stone-50">
      
      {/* Search Header Info */}
      {query && (
        <div className="bg-orange-50/50 border-b border-orange-100 py-3">
          <div className="container mx-auto px-4">
            <p className="text-sm font-medium text-stone-600">
              Showing search results for: <span className="font-bold text-orange-600">"{query}"</span>
            </p>
          </div>
        </div>
      )}

      {/* Discovery Filters Header */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">Food Drops Near You</h1>
          <p className="text-stone-500 mb-6">Pre-order from verified home chefs before they sell out</p>
          
          <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
            <span><span className="text-stone-900 font-bold">{drops.filter(d=>d.status==='OPEN').length}</span> drops open</span>
            <span className="text-stone-300">•</span>
            <span><span className="text-stone-900 font-bold">{closingSoonDrops.length}</span> closing today</span>
            <span className="text-stone-300">•</span>
            <span><span className="text-stone-900 font-bold">24</span> creators</span>
          </div>
        </div>
      </div>

      {/* FILTER BAR (Sticky) */}
      <div className="sticky top-16 z-40 bg-white border-b border-stone-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex overflow-x-auto no-scrollbar w-full md:w-auto gap-2 py-1 items-center">
            
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2 hidden md:block">Status:</span>
            {['All', 'Open Now', 'Coming Soon', 'Closing Soon'].map(status => (
              <button 
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors border ${
                  activeStatus === status ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {status}
              </button>
            ))}

            <div className="w-px h-6 bg-stone-200 mx-2 hidden md:block"></div>

            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2 hidden md:block">Type:</span>
            {['All', 'Baked Goods', 'Meals', 'Desserts', 'Tiffin'].map(type => (
              <button 
                key={type}
                onClick={() => setActiveType(type)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors border ${
                  activeType === type ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="w-full md:w-auto flex items-center shrink-0">
            <button
              onClick={() => setIsLocationOpen(true)}
              className="flex items-center gap-1.5 w-full md:w-auto px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 hover:bg-orange-50 hover:border-orange-300 transition-colors"
            >
              <span className="font-medium">{cityName || '📍 Set Location'}</span>
              <ChevronDown size={16} className="text-stone-400" />
            </button>
          </div>
          {isLocationOpen && <LocationPrompt canSkip={true} onClose={() => setIsLocationOpen(false)} />}
        </div>
      </div>

      {/* ACTIVE FILTERS (Pills) */}
      {(activeStatus !== 'All' || activeType !== 'All') && (
        <div className="container mx-auto px-4 pt-4 flex gap-2">
          {activeStatus !== 'All' && (
            <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
              Status: {activeStatus}
              <button onClick={() => setActiveStatus('All')} className="hover:text-orange-500"><X size={12} /></button>
            </div>
          )}
          {activeType !== 'All' && (
            <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
              Type: {activeType}
              <button onClick={() => setActiveType('All')} className="hover:text-orange-500"><X size={12} /></button>
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 space-y-12">
        <NoLocationBanner />
        
        {/* PERSONALIZED FEED (Auth only) */}
        {isAuthenticated && followedDrops.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="font-display text-2xl font-bold text-stone-900">From creators you follow</h2>
              <p className="text-stone-500 text-sm mt-1">You follow 5 creators</p>
            </div>
            <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {followedDrops.map(drop => (
                <div key={drop.dropId} className="min-w-[280px] max-w-[300px]">
                  <DropCard {...drop} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CLOSING SOON SECTION */}
        {closingSoonDrops.length > 0 && (
          <section className="bg-white border-l-4 border-orange-500 rounded-r-2xl p-6 shadow-sm border-y border-r border-stone-100">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <span className="text-orange-500">⚡</span> Closing Soon
                </h2>
                <p className="text-stone-500 text-sm mt-1">These drops close soon — secure your slot</p>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
              {closingSoonDrops.map(drop => (
                <div key={drop.dropId} className="min-w-[280px] max-w-[300px]">
                  <DropCard {...drop} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ALL DROPS GRID */}
        <section>
          {filteredDrops.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-100 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-4xl mb-6 shadow-sm">
                🧑‍🍳
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">
                {cityName ? `No drops available in ${cityName} right now` : 'No drops available right now'}
              </h3>
              <p className="text-stone-500 mb-8 max-w-md mx-auto">
                {cityName 
                  ? "We couldn't find any creators dropping food near this location. Try expanding your search or check back later."
                  : "Follow your favourite creators to get notified when they announce their next delicious drop."}
              </p>
              <button 
                onClick={() => setIsLocationOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-8 py-3 transition-colors shadow-sm"
              >
                Change Location
              </button>
            </div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredDrops.map(drop => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      key={drop.dropId}
                    >
                      <DropCard {...drop} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {isPlaceholderData && (
                 <div className="text-center text-sm text-stone-400 mt-4">Updating results...</div>
              )}

              {/* LOAD MORE */}
              <div className="mt-12 flex justify-center">
                <button className="bg-white border border-stone-200 text-stone-700 font-semibold rounded-xl px-8 py-3 hover:bg-stone-50 transition-colors shadow-sm">
                  Load more drops
                </button>
              </div>
            </>
          )}
        </section>

      </div>
    </div>
  );
}
