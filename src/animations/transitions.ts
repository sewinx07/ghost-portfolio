import gsap from 'gsap';
import { prefersReducedMotion } from './utils';

/**
 * Cinematic scene transition: a veil of leaves + fog crosses the screen,
 * the environment releases, and the outgoing scene is replaced.
 */
export function playSceneTransition(
  veil: HTMLElement,
  { onMid }: { onMid: () => void },
): () => void {
  const reduced = prefersReducedMotion();
  if (reduced) {
    onMid();
    return () => {};
  }

  gsap.set(veil, { opacity: 0, scale: 0.85, pointerEvents: 'auto' });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      gsap.set(veil, { pointerEvents: 'none', opacity: 0, scale: 0.85 });
    },
  });

  tl.to(veil, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.in' })
    .add(() => onMid())
    .to(veil, { opacity: 0, duration: 0.7, ease: 'power3.out' });

  return () => tl.kill();
}
