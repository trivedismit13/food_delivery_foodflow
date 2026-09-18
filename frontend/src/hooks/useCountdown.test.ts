import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts down to an absolute future target', () => {
    const futureDate = new Date(Date.now() + 5000).toISOString();
    const { result } = renderHook(() => useCountdown(futureDate));
    
    expect(result.current.isPast).toBe(false);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.isPast).toBe(true);
  });

  it('does not reset the target on re-render', () => {
    const futureDate = new Date(Date.now() + 5000).toISOString();
    const { result, rerender } = renderHook(() => useCountdown(futureDate));

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(result.current.isPast).toBe(false);

    rerender();
    expect(result.current.isPast).toBe(false);
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.isPast).toBe(true);
  });
});
