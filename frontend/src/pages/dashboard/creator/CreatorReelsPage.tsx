import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCreateReel, useRestaurantReels } from '@/queries/reels';
import { Loader2 } from 'lucide-react';
import { Reel } from '@/types/reel';

export default function CreatorReelsPage() {
  const { creatorProfile } = useAuthStore();
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const restaurantId = creatorProfile?.restaurantId;

  const { data: reels, isLoading } = useRestaurantReels(restaurantId as number);
  const { mutate: createReel, isPending: isCreating } = useCreateReel(restaurantId as number);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !mediaUrl) return;
    
    createReel({ title, mediaUrl }, {
      onSuccess: () => {
        setTitle('');
        setMediaUrl('');
      }
    });
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i) || url.includes('video');
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Your Reels</h1>
        <p className="text-stone-500">Manage your short-form video content.</p>
      </div>
      
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100">
        <h2 className="text-xl font-bold text-stone-900 mb-6">Upload New Reel</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Making of our special biryani"
              className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Media URL</label>
            <input 
              type="url" 
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isCreating}
            className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            {isCreating ? 'Publishing...' : 'Publish Reel'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold text-stone-900 mb-6">Published Reels</h2>
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-orange-500" />
          </div>
        ) : reels?.content.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-12 text-center border border-stone-100">
            <p className="text-stone-500">You haven't published any reels yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels?.content.map((reel: Reel) => (
              <div key={reel.reelId} className="bg-white border border-stone-100 rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[9/16] bg-stone-100">
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
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-stone-900">{reel.title}</h3>
                  <p className="text-sm text-stone-500 mt-1">
                    {new Date(reel.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
