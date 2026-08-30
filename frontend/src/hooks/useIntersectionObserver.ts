import { useEffect, useRef, useState, MutableRefObject } from 'react';

export function useIntersectionObserver<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
): [MutableRefObject<T | null>, IntersectionObserverEntry | null] {
  const ref = useRef<T | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return [ref, entry];
}
