import gsap from 'gsap';
import { prefersReducedMotion } from './utils';

/**
 * Cinematic scene transition: a near-opaque dark veil pulls in with a slow
 * zoom, the scene and content both swap behind full cover, then the veil
 * eases open with a slight push-out. Reduced motion swaps instantly.
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

  gsap.set(veil, { opacity: 0, scale: 0.86 });

  let midFired = false;
  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      gsap.set(veil, { opacity: 0, scale: 1 });
    },
  });

  tl.to(veil, { opacity: 1, scale: 1, duration: 0.62, ease: 'power3.inOut' })
    .add(() => {
      if (!midFired) {
        midFired = true;
        onMid();
      }
    }, 0.62)
    .to(veil, { opacity: 0, scale: 1.04, duration: 0.78, ease: 'power3.inOut' }, '+=0.1');

  return () => {
    tl.kill();
    gsap.set(veil, { opacity: 0, scale: 1 });
  };
}