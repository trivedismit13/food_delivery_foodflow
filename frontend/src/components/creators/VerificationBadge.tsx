import { cn } from '@/lib/utils';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface VerificationBadgeProps {
  level: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md';
  className?: string;
}

export function VerificationBadge({ level, size = 'sm', className }: VerificationBadgeProps) {
  if (level === 0) return null;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';
  const iconSize = size === 'sm' ? 12 : 14;

  if (level === 1) {
    return (
      <div 
        className={cn("inline-flex items-center gap-1 bg-stone-100 text-stone-600 rounded-full font-medium whitespace-nowrap", sizeClasses, className)}
        title="Verified Creator"
      >
        <ShieldCheck size={iconSize} />
        <span>Verified Creator</span>
      </div>
    );
  }

  if (level === 2) {
    return (
      <div 
        className={cn("inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 rounded-full font-medium whitespace-nowrap", sizeClasses, className)}
        title="Food License Verified"
      >
        <CheckCircle2 size={iconSize} />
        <span>Food Licensed</span>
      </div>
    );
  }

  if (level === 3) {
    return (
      <div 
        className={cn("inline-flex items-center gap-1 bg-orange-50 text-orange-600 rounded-full font-medium whitespace-nowrap", sizeClasses, className)}
        title="Kitchen Verified"
      >
        <Award size={iconSize} />
        <span>Kitchen Verified</span>
      </div>
    );
  }

  return null;
}
