import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Heart, Clock, ShoppingBag } from 'lucide-react';
import { DropCard } from '@/components/drops/DropCard';
import { CreatorCard } from '@/components/creators/CreatorCard';
import { useActiveDropsFeed } from '@/queries/drops';
import { useCreators } from '@/queries/creators';
import { DropCardSkeleton } from '@/components/skeletons/DropCardSkeleton';
import { CreatorCardSkeleton } from '@/components/skeletons/CreatorCardSkeleton';
import { useLocationStore } from '@/store/locationStore';

export default function HomePage() {
  const { cityId, lat, lng, cityName } = useLocationStore();
  const { data: dropsPage, isLoading: isLoadingDrops } = useActiveDropsFeed({ size: 4, cityId: cityId || undefined, lat: lat || undefined, lng: lng || undefined });
  const drops = dropsPage?.content;

  const { data: creatorsPage, isLoading: isLoadingCreators } = useCreators({ size: 6 });
  const creators = creatorsPage?.content;

  return (
    <div className="pb-20">
      {/* SECTION 1: Hero */}
      <section className="relative w-full bg-gradient-to-b from-orange-50 via-amber-50/50 to-background-base overflow-hidden">
        <div className="container mx-auto px-4 h-[500px] md:h-[600px] flex flex-col md:flex-row items-center pt-8 md:pt-0">
          
          <div className="w-full md:w-[60%] flex flex-col z-10 text-center md:text-left mt-8 md:mt-0">
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-4 inline-flex items-center justify-center md:justify-start gap-2">
              🧑‍🍳 Verified Home Chefs & Independent Creators
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.15] mb-6">
              Pre-order food made<br />
              <span className="text-orange-500">with love, not shortcuts.</span>
            </h1>
            <p className="text-lg text-stone-600 font-normal max-w-md mb-8 mx-auto md:mx-0">
              Biryani slow-cooked overnight. Cakes baked to order. Tiffins made just like home. Discover independent food creators and pre-book before they sell out.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start mb-8">
              <Link to="/drops" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 py-4 font-semibold shadow-sm transition-colors text-center">
                Explore Drops Today
              </Link>
              <Link to="/auth/register/creator" className="w-full sm:w-auto bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl px-8 py-4 font-semibold transition-colors text-center shadow-sm">
                Start Selling
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-2 justify-center md:justify-start">
              <span className="text-sm text-stone-500 flex items-center gap-1.5">
                <Check size={16} className="text-emerald-500" /> Identity Verified Creators
              </span>
              <span className="text-sm text-stone-500 flex items-center gap-1.5">
                <Check size={16} className="text-emerald-500" /> Pre-order before they sell out
              </span>
              <span className="text-sm text-stone-500 flex items-center gap-1.5">
                <Check size={16} className="text-emerald-500" /> Authentic home cooking
              </span>
            </div>
          </div>

          {/* Hero Images (Desktop) - Unchanged */}
          <div className="hidden md:flex w-[40%] h-full relative items-center justify-end pr-8">
            <motion.div 
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 6 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute z-10 right-4 top-24 w-64 bg-white p-3 rounded-2xl shadow-warm-lg"
            >
              <div className="h-32 bg-gradient-to-br from-orange-200 to-amber-200 rounded-xl mb-3"></div>
              <h4 className="font-display font-bold text-stone-800">Sunday Biryani</h4>
              <p className="text-xs text-stone-500">Priya's Kitchen</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: -4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute z-0 right-32 bottom-32 w-56 bg-white p-3 rounded-2xl shadow-warm-lg"
            >
              <div className="h-28 bg-gradient-to-br from-amber-200 to-yellow-100 rounded-xl mb-3"></div>
              <h4 className="font-display font-bold text-stone-800">Fresh Tartlets</h4>
              <p className="text-xs text-stone-500">The Sugar Studio</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: How It Works */}
      <section className="bg-white py-16 border-y border-stone-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                <Heart size={28} />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Follow your favourite creators</h3>
              <p className="text-sm text-stone-500">Get notified the moment they announce a new drop.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                <Clock size={28} />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Pre-order before cutoff</h3>
              <p className="text-sm text-stone-500">Creators set an order cutoff. Book your slot before it closes.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Collect fresh food</h3>
              <p className="text-sm text-stone-500">The creator prepares exactly what was ordered. No waste, no guessing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Active Drops */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-stone-900">Drops Closing Soon</h2>
              <p className="text-stone-500 mt-1">Order before the window closes — these won't last</p>
            </div>
            <Link to="/drops" className="text-orange-500 font-semibold hover:text-orange-600 hidden sm:block">
              View All Drops →
            </Link>
          </div>
          
          {isLoadingDrops ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <DropCardSkeleton key={i} />)}
            </div>
          ) : drops && drops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {drops.map(drop => (
                <DropCard 
                  key={drop.dropId}
                  {...drop}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 shadow-sm">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="font-display font-bold text-xl text-stone-800 mb-2">
                {cityName ? `No drops found near ${cityName}` : 'No drops available right now'}
              </h3>
              <p className="text-stone-500 mb-6 text-sm max-w-md mx-auto">
                {cityName 
                  ? "We couldn't find any creators dropping food in this area. Try searching a different location." 
                  : "We couldn't find any active drops. Check back later."}
              </p>
              <Link to="/drops" className="inline-block bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg px-6 py-2.5 transition-colors">
                Browse all locations
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: Meet Our Creators */}
      <section className="py-16 bg-white border-y border-stone-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-stone-900">
                {cityName ? `Independent creators in ${cityName}` : 'Independent creators near you'}
              </h2>
              <p className="text-stone-500 mt-1">Verified chefs, bakers, and food entrepreneurs</p>
            </div>
          </div>

          {isLoadingCreators ? (
            <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {[1,2,3].map(i => <div key={i} className="min-w-[280px] max-w-[300px]"><CreatorCardSkeleton /></div>)}
            </div>
          ) : creators && creators.length > 0 ? (
            <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {creators.map(creator => (
                <div key={creator.restaurantId} className="min-w-[280px] max-w-[300px]">
                  <CreatorCard 
                    id={creator.restaurantId}
                    name={creator.name}
                    creatorType={creator.creatorType}
                    city={creator.city}
                    bioSnippet={creator.bio || ''}
                    followerCount={creator.followerCount}
                    totalOrders={creator.totalOrdersCompleted}
                    verificationLevel={creator.verificationLevel}
                    hasActiveDrop={creator.isOpen}
                    topCategories={creator.cuisine ? creator.cuisine.split(',') : undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 shadow-sm mx-4 sm:mx-0">
              <div className="text-4xl mb-4">🧑‍🍳</div>
              <h3 className="font-display font-bold text-xl text-stone-800 mb-2">
                {cityName ? `No creators found in ${cityName}` : 'No creators found'}
              </h3>
              <p className="text-stone-500 mb-6 text-sm max-w-md mx-auto">
                {cityName 
                  ? "We don't have any verified creators in this area yet." 
                  : "We couldn't find any creators at the moment."}
              </p>
              <Link to="/auth/register/creator" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6 py-2.5 transition-colors">
                Become a creator
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: Reels Section */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">What's coming up</h2>
              <p className="text-stone-400 mt-1">Short clips from creators announcing their next drops</p>
            </div>
            <Link to="/reels" className="text-orange-400 font-semibold hover:text-orange-300 hidden sm:block">
              View all →
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {[1,2,3,4,5,6].map(i => (
              <Link to="/drops/1" key={i} className="group relative flex-shrink-0 w-40 h-60 rounded-2xl overflow-hidden shadow-sm hover:shadow-orange-500/20 transition-all hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-700 to-stone-800"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <div className="w-4 h-4 ml-1 border-y-[8px] border-y-transparent border-l-[12px] border-l-white"></div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-semibold text-sm truncate">Sunday Roast Drop</p>
                  <p className="text-white/60 text-xs truncate mt-0.5">Chef Rohan</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
