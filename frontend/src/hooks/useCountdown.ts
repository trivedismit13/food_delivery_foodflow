import { useState, useEffect } from 'react';

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
  // If server provided minutesUntilCutoff, compute target absolute timestamp based on it
  const initialTarget = serverMinutesUntilCutoff != null 
    ? Date.now() + (serverMinutesUntilCutoff * 60 * 1000) 
    : targetTime;

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(initialTarget));
  
  useEffect(() => {
    // Avoid running interval if already past
    if (calculateTimeLeft(initialTarget).isPast) {
      setTimeLeft(calculateTimeLeft(initialTarget));
      return;
    }

    const timer = setInterval(() => {
      const nextTimeLeft = calculateTimeLeft(initialTarget);
      setTimeLeft(nextTimeLeft);
      if (nextTimeLeft.isPast) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [initialTarget]);
  
  return timeLeft;
}
