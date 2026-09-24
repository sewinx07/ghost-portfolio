export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = (): boolean =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window);

export const isDesktop = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
