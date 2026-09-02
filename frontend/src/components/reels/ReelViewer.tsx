import React, { useRef, useEffect, useState } from 'react';
import { Reel } from '@/types/reel';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useNavigate } from 'react-router-dom';
import { useFollowStatus, useFollowCreator, useUnfollowCreator } from '@/queries/creators';

interface ReelViewerProps {
  reel: Reel;
}

export default function ReelViewer({ reel }: ReelViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const navigate = useNavigate();

  const [ref, entry] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.6,
  });

  const isIntersecting = entry?.isIntersecting ?? false;
  const isVideo = reel.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) !== null || !reel.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/i); // Default to video if not explicitly image
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isIntersecting) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Autoplay prevented:", err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isIntersecting]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const { data: isFollowing, isLoading: isFollowLoading } = useFollowStatus(reel.restaurantId);
  const { mutate: followCreator, isPending: isFollowingCreator } = useFollowCreator();
  const { mutate: unfollowCreator, isPending: isUnfollowingCreator } = useUnfollowCreator();

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFollowing) {
      unfollowCreator(reel.restaurantId);
    } else {
      followCreator(reel.restaurantId);
    }
  };

  const isFollowMutating = isFollowingCreator || isUnfollowingCreator || isFollowLoading;

  return (
    <div 
      ref={ref} 
      className="relative w-full h-full max-w-md mx-auto bg-black flex items-center justify-center overflow-hidden"
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={reel.mediaUrl}
          loop
          muted
          playsInline
          className="w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
        />
      ) : (
        <img
          src={reel.mediaUrl}
          alt={reel.title}
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay details */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <div>
            <h2 className="text-white text-lg font-bold">{reel.restaurantName}</h2>
            <p className="text-white text-sm opacity-90">{reel.title}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-2 pointer-events-auto">
          <button
            onClick={() => navigate(`/creators/${reel.restaurantId}`)}
            className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition"
          >
            View Seller
          </button>
          
          <button
            onClick={handleFollowToggle}
            disabled={isFollowMutating}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition border ${
              isFollowing
                ? 'bg-transparent border-white text-white hover:bg-white/20'
                : 'bg-primary border-primary text-white hover:bg-primary/90'
            } disabled:opacity-50`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  );
}
