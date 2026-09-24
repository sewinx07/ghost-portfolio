import gsap from 'gsap';
import { isTouch, prefersReducedMotion } from './utils';

/**
 * Mouse parallax — different layers drift at different speeds.
 * Subtle on background, stronger on foreground leaves, minimal on UI.
 * Apply this only to layers that carry NO other transform.
 */
export function initParallax(scope: HTMLElement): () => void {
  if (isTouch() || prefersReducedMotion()) return () => {};

  const layers = Array.from(
    scope.querySelectorAll<HTMLElement>('[data-depth]'),
  );
  if (!layers.length) return () => {};

  const targets = layers.map((el) => {
    const depth = parseFloat(el.dataset.depth || '0.2');
    return { el, depth, cx: 0, cy: 0, tx: 0, ty: 0 };
  });

  const onMove = (e: MouseEvent) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    targets.forEach((t) => {
      t.tx = nx * t.depth * 70;
      t.ty = ny * t.depth * 46;
    });
  };

  const tick = () => {
    targets.forEach((t) => {
      t.cx += (t.tx - t.cx) * 0.06;
      t.cy += (t.ty - t.cy) * 0.06;
      t.el.style.transform = `translate3d(${t.cx.toFixed(1)}px, ${t.cy.toFixed(1)}px, 0)`;
    });
  };

  window.addEventListener('mousemove', onMove);
  gsap.ticker.add(tick);

  return () => {
    window.removeEventListener('mousemove', onMove);
    gsap.ticker.remove(tick);
  };
}
