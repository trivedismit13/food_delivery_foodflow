import { useState, useEffect, useMemo } from 'react';

export function calculateTimeLeft(targetTime: string | number) {
  let difference = 0;
  if (typeof targetTime === 'number') {
    difference = targetTime - new Date().getTime(); // targetTime can be the target timestamp directly
  } else {
    difference = new Date(targetTime).getTime() - new Date().getTime();
  }
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalMs: 0 };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isPast: false,
    totalMs: difference
  };
}

export function useCountdown(targetTime: string, serverMinutesUntilCutoff?: number | null) {
  // Use useMemo to prevent recomputing the target (and thus Date.now()) on every render.
  // Since targetTime is now explicitly offset-aware from the API (e.g. ...Z or ...+05:30),
  // we prefer it for absolute countdowns. We fallback to serverMinutes if needed.
  const stableTarget = useMemo(() => {
    if (targetTime) return targetTime;
    return serverMinutesUntilCutoff != null 
      ? Date.now() + (serverMinutesUntilCutoff * 60 * 1000) 
      : targetTime;
  }, [targetTime, serverMinutesUntilCutoff]);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(stableTarget));
  
  useEffect(() => {
    const initialCalc = calculateTimeLeft(stableTarget);
    if (initialCalc.isPast) {
      setTimeLeft(initialCalc);
      return;
    }

    setTimeLeft(initialCalc);

    const timer = setInterval(() => {
      const nextTimeLeft = calculateTimeLeft(stableTarget);
      setTimeLeft(nextTimeLeft);
      if (nextTimeLeft.isPast) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [stableTarget]);
  
  return timeLeft;
}
