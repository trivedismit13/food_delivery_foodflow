import { cn } from '@/lib/utils';
import { useCountdown } from '@/hooks/useCountdown';

interface CountdownTimerProps {
  cutoffTime: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CountdownTimer({ cutoffTime, size = 'sm', className }: CountdownTimerProps) {
  const timeLeft = useCountdown(cutoffTime);
  
  if (timeLeft.isPast) {
    return (
      <span className={cn("text-stone-500 font-medium", size === 'sm' ? 'text-xs' : 'text-sm', className)}>
        Order window closed
      </span>
    );
  }
  
  const totalHours = timeLeft.days * 24 + timeLeft.hours;
  
  // Color and animation logic
  let textColor = 'text-stone-600';
  let animation = '';
  let urgencyText = '';
  
  if (totalHours < 1) {
    textColor = 'text-red-500';
    animation = 'animate-pulse font-bold';
    urgencyText = '⚡ Closing very soon!';
  } else if (totalHours < 2) {
    textColor = 'text-amber-600';
    animation = 'animate-pulse';
  } else if (totalHours < 24) {
    textColor = 'text-amber-600';
  }
  
  if (size === 'sm') {
    if (timeLeft.days > 0) {
      return <span className={cn("text-xs font-medium", textColor, className)}>Closes in {timeLeft.days} {timeLeft.days === 1 ? 'day' : 'days'}</span>;
    }
    if (totalHours > 2) {
      return <span className={cn("text-xs font-medium", textColor, className)}>Closes in {totalHours}h {timeLeft.minutes}m</span>;
    }
    // Real time countdown for < 2 hours
    return (
      <span className={cn("text-xs font-medium", textColor, animation, className)}>
        Closes in {totalHours}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    );
  }

  // md and lg displays for drop detail pages
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <span className={cn("font-bold font-display bg-stone-50 border border-stone-200 rounded-md flex items-center justify-center", 
            size === 'md' ? 'w-10 h-10 text-lg' : 'w-14 h-14 text-2xl',
            textColor, animation
          )}>
            {totalHours.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-stone-500 uppercase font-medium mt-1">Hrs</span>
        </div>
        <span className="text-xl font-bold text-stone-300 pb-4">:</span>
        <div className="flex flex-col items-center">
          <span className={cn("font-bold font-display bg-stone-50 border border-stone-200 rounded-md flex items-center justify-center", 
            size === 'md' ? 'w-10 h-10 text-lg' : 'w-14 h-14 text-2xl',
            textColor, animation
          )}>
            {timeLeft.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-stone-500 uppercase font-medium mt-1">Min</span>
        </div>
        <span className="text-xl font-bold text-stone-300 pb-4">:</span>
        <div className="flex flex-col items-center">
          <span className={cn("font-bold font-display bg-stone-50 border border-stone-200 rounded-md flex items-center justify-center", 
            size === 'md' ? 'w-10 h-10 text-lg' : 'w-14 h-14 text-2xl',
            textColor, animation
          )}>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-stone-500 uppercase font-medium mt-1">Sec</span>
        </div>
      </div>
      {urgencyText && <span className="text-xs text-red-500 font-medium mt-1">{urgencyText}</span>}
    </div>
  );
}
