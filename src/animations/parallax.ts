import gsap from 'gsap';
import { isTouch, prefersReducedMotion } from './utils';

/**
 * Mouse parallax — different layers drift at different speeds.
 * Subtle on background, stronger on foreground leaves, minimal on UI.
 * Uses gsap.quickTo so each layer eases toward its target every frame,
 * with will-change set once to avoid layer promotions mid-motion.
 */
export function initParallax(scope: HTMLElement): () => void {
  if (isTouch() || prefersReducedMotion()) return () => {};

  const layers = Array.from(
    scope.querySelectorAll<HTMLElement>('[data-depth]'),
  );
  if (!layers.length) return () => {};

  const targets = layers.map((el) => {
    const depth = parseFloat(el.dataset.depth || '0.2');
    el.style.willChange = 'transform';
    return {
      el,
      depth,
      moveX: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      moveY: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
    };
  });

  const onMove = (e: MouseEvent) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 70;
    const ny = (e.clientY / window.innerHeight - 0.5) * 46;
    targets.forEach((t) => {
      t.moveX(nx * t.depth);
      t.moveY(ny * t.depth);
    });
  };

  window.addEventListener('mousemove', onMove, { passive: true });

  return () => {
    window.removeEventListener('mousemove', onMove);
    targets.forEach((t) => {
      t.moveX.tween.kill();
      t.moveY.tween.kill();
      t.el.style.willChange = '';
    });
  };
}
