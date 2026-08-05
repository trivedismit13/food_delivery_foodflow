import { useState, useEffect } from 'react';

export function calculateTimeLeft(targetTime: string) {
  const difference = new Date(targetTime).getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalMs: difference };
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

export function useCountdown(targetTime: string) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);
  
  return timeLeft;
}
