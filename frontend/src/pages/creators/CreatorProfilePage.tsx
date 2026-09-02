import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2, Bell, Check } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { VerificationBadge } from '@/components/creators/VerificationBadge';
import { DropCard } from '@/components/drops/DropCard';
import { 
  useCreatorById, 
  useCreatorRatings, 
  useFollowCreator, 
  useUnfollowCreator,
  useFollowStatus 
} from '@/queries/creators';
import { useMenu } from '@/queries/menu';
import { useRestaurantReels } from '@/queries/reels';
import type { MenuItemResponse } from '@/types/menu';
import type { Reel } from '@/types/reel';

export default function CreatorProfilePage() {
  const { creatorId } = useParams();
  const id = Number(creatorId);
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Drops');
  const [dropsSubFilter, setDropsSubFilter] = useState<'Active' | 'Past'>('Active');
  
  const isOwner = user?.role === 'SELLER' && user?.userId === id;
  
  const { data: creator, isLoading } = useCreatorById(id);
  const { data: menuItems = [], isLoading: isLoadingMenu } = useMenu(id);
  const { data: ratings, isLoading: isLoadingRatings } = useCreatorRatings(id);
  const { data: reels, isLoading: isLoadingReels } = useRestaurantReels(id);
  const { data: isFollowing } = useFollowStatus(user ? id : undefined);
  
  const followMutation = useFollowCreator();
  const unfollowMutation = useUnfollowCreator();

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i) || url.includes('video');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
      </div>
    );
  }

  if (!creator) return <div className="p-8 text-center text-stone-500">Creator not found</div>;

  const tabs = ['Drops', 'Menu', 'Reviews', 'Reels'];
  
  // Assuming activeDrops from backend contains both OPEN and ANNOUNCED drops
  const activeDrops = creator.activeDrops || [];

  const handleFollowToggle = () => {
    if (!user) {
      // should redirect to login but for now just ignore or toast
      return;
    }
    if (isFollowing) {
      unfollowMutation.mutate(id);
    } else {
      followMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-orange-200 via-amber-200 to-rose-200 w-full relative">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start -mt-16 mb-6">
          <div className="w-32 h-32 rounded-3xl bg-white shadow-lg border-4 border-white flex items-center justify-center text-4xl font-bold text-orange-600 shrink-0">
            {creator.name.charAt(0)}
          </div>
          
          <div className="flex-1 pt-2 md:pt-16">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-3xl font-bold text-stone-900">{creator.name}</h1>
              <VerificationBadge level={creator.verificationLevel} />
            </div>
            
            <div className="flex items-center gap-4 text-stone-600 text-sm mt-2 font-medium flex-wrap">

              <span className="flex items-center gap-1"><Star size={16} className="fill-orange-400 text-orange-400" /> {creator.avgRating.toFixed(1)}</span>
              <span>{creator.cuisine}</span>
              <span className="px-2 py-0.5 bg-stone-200 rounded-md text-xs">{creator.creatorType.replace('_', ' ')}</span>
            </div>
            

            
            <p className="mt-4 text-stone-700 max-w-2xl leading-relaxed">
              {creator.bio}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="text-stone-500 font-medium text-sm">
              <span className="text-stone-900 font-bold text-xl">{creator.followerCount}</span> followers
            </div>
            
            {isOwner ? (
              <Link 
                to="/dashboard/creator/profile" 
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-white text-stone-900 font-bold hover:bg-stone-100 transition-colors shadow-sm border border-stone-200 text-center"
              >
                Manage Your Profile
              </Link>
            ) : (
              <button 
                onClick={handleFollowToggle}
                disabled={followMutation.isPending || unfollowMutation.isPending}
                className={cn(
                  "w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2",
                  isFollowing 
                    ? "bg-stone-100 text-stone-800 hover:bg-stone-200" 
                    : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20"
                )}
              >
                {isFollowing ? (
                  <><Check size={18} /> Following</>
                ) : (
                  <><Bell size={18} /> Follow</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar relative">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-4 text-sm font-semibold transition-colors relative whitespace-nowrap",
                  activeTab === tab ? "text-orange-500" : "text-stone-500 hover:text-stone-800"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* DROPS TAB */}
        {activeTab === 'Drops' && (
          <div>
            <div className="flex gap-2 mb-8">
              {['Active', 'Past'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setDropsSubFilter(filter as any)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold transition-colors border",
                    dropsSubFilter === filter 
                      ? "bg-stone-800 text-white border-stone-800" 
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            {dropsSubFilter === 'Active' && (
              <div className="space-y-6">
                {activeDrops.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-stone-100">
                    <p className="text-lg font-semibold text-stone-800 mb-2">No active drops right now</p>
                    <p className="text-stone-500">Follow {creator.name} to get notified when they announce one.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeDrops.map(drop => (
                      <DropCard key={drop.dropId} {...drop} />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {dropsSubFilter === 'Past' && (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-100">
                <p className="text-stone-500">Past drops will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* MENU TAB */}
        {activeTab === 'Menu' && (
          <div>
            {isLoadingMenu ? (
               <Loader2 className="animate-spin text-orange-500 mx-auto" />
            ) : menuItems?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-100">
                <h3 className="text-lg font-semibold text-stone-800 mb-2">No Menu Items</h3>
                <p className="text-stone-500">This creator sells exclusively through drops right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems?.map((item: MenuItemResponse) => (
                  <div key={item.menuItemId} className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-stone-800">{item.name}</h4>
                      <p className="text-stone-500 text-sm mt-1 mb-2">{item.description}</p>
                      <div className="font-bold text-stone-900">₹{item.price}</div>
                    </div>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'Reviews' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {isLoadingRatings ? (
               <Loader2 className="animate-spin text-orange-500 mx-auto" />
            ) : ratings?.content.length === 0 ? (
               <div className="bg-white p-8 rounded-2xl border border-stone-100 text-center text-stone-500">
                 No reviews yet.
               </div>
            ) : (
              ratings?.content.map(rating => (
                <div key={rating.ratingId} className="bg-white p-5 rounded-2xl border border-stone-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold uppercase">
                        {rating.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800 text-sm">{rating.customerName}</p>
                        <p className="text-xs text-stone-400">{new Date(rating.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                         <Star key={i} size={14} className={i < rating.score ? "fill-orange-400 text-orange-400" : "fill-stone-200 text-stone-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {rating.reviewText}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* REELS TAB */}
        {activeTab === 'Reels' && (
          <div>
            {isLoadingReels ? (
               <Loader2 className="animate-spin text-orange-500 mx-auto" />
            ) : !reels?.content || reels.content.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-100">
                <h3 className="text-lg font-semibold text-stone-800 mb-2">No reels yet</h3>
                <p className="text-stone-500">Check back later for behind-the-scenes content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {reels.content.map((reel: Reel) => (
                  <div key={reel.reelId} className="relative aspect-[9/16] bg-stone-100 rounded-2xl overflow-hidden group cursor-pointer border border-stone-200">
                    {isVideo(reel.mediaUrl) ? (
                      <video 
                        src={reel.mediaUrl} 
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={reel.mediaUrl} 
                        alt={reel.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-semibold text-sm line-clamp-2 shadow-sm">{reel.title}</p>
                        <p className="text-stone-300 text-xs mt-1 shadow-sm">{new Date(reel.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
