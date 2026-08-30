import React, { useEffect } from 'react';
import { useDiscoveryReelsInfinite } from '@/queries/reels';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import ReelViewer from '@/components/reels/ReelViewer';

export default function CustomerReelsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useDiscoveryReelsInfinite();

  const [ref, entry] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return (
      <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center bg-black text-white">
        <p>Failed to load reels. Please try again later.</p>
      </div>
    );
  }

  const allReels = data?.pages.flatMap((page) => page.content) || [];

  if (allReels.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center bg-black text-white">
        <p>No reels available yet.</p>
      </div>
    );
  }

  return (
    <div 
      className="h-[calc(100vh-64px)] w-full bg-black overflow-y-scroll snap-y snap-mandatory relative"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {allReels.map((reel) => (
        <div key={reel.reelId} className="h-full w-full snap-start flex justify-center items-center">
          <ReelViewer reel={reel} />
        </div>
      ))}

      {/* Loading trigger for next page */}
      <div ref={ref} className="h-10 w-full flex-shrink-0 flex items-center justify-center snap-start">
        {isFetchingNextPage && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
      </div>
    </div>
  );
}
