import gsap from 'gsap';
import { isTouch, prefersReducedMotion } from './utils';

/**
 * Custom cursor — desktop only. Small dot that expands with a context label
 * over interactive elements. Hidden on touch and reduced motion.
 */
export function initCursor(): () => void {
  if (isTouch() || prefersReducedMotion()) return () => {};

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.innerHTML = `<span class="cursor-dot"></span><span class="cursor-label"></span>`;
  document.body.appendChild(cursor);

  const labelEl = cursor.querySelector<HTMLElement>('.cursor-label')!;
  const dot = cursor.querySelector<HTMLElement>('.cursor-dot')!;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;
  let visible = false;

  const onMove = (e: MouseEvent) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!visible) {
      visible = true;
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    }
  };

  const onOver = (e: MouseEvent) => {
    const t = (e.target as HTMLElement).closest(
      'a, button, [data-cursor], .project-card, .menu-item, [role="menuitem"]',
    );
    if (t) {
      const label = (t as HTMLElement).dataset.cursor || '';
      labelEl.textContent = label;
      gsap.to(dot, { scale: 2.4, duration: 0.25, ease: 'power2.out' });
      if (label) gsap.to(labelEl, { opacity: 1, duration: 0.25 });
    }
  };

  const onLeave = () => {
    labelEl.textContent = '';
    gsap.to(dot, { scale: 1, duration: 0.25 });
    gsap.to(labelEl, { opacity: 0, duration: 0.2 });
  };

  const tick = () => {
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  };
  gsap.ticker.add(tick);

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseover', onOver);
  window.addEventListener('mouseout', onLeave);

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseover', onOver);
    window.removeEventListener('mouseout', onLeave);
    cursor.remove();
  };
}
