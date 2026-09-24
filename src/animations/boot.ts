import gsap from 'gsap';
import { prefersReducedMotion } from './utils';

export interface BootHandlers {
  onComplete: () => void;
  onSkip: () => void;
}

const SKIP_KEY = 'sewinx-intro-seen';

export function shouldSkipIntro(): boolean {
  try {
    return sessionStorage.getItem(SKIP_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Runs the SEWINX boot sequence: black screen, progressive system text,
 * percentage counter, flicker, then reveal. Calls onComplete when done.
 */
export function runBoot(root: HTMLElement, handlers: BootHandlers): () => void {
  const reduced = prefersReducedMotion();
  const lines = [
    'SEWINX SYSTEM',
    'INITIALIZING ...',
    'LOADING CREATIVE ENGINE ...',
    'LOADING DESIGN ...',
    'LOADING CODE ...',
    'LOADING PROJECT DATABASE ...',
  ];
  const total = 100;
  const lineEl = root.querySelector<HTMLElement>('[data-boot-line]')!;
  const pctEl = root.querySelector<HTMLElement>('[data-boot-pct]')!;
  const barEl = root.querySelector<HTMLElement>('[data-boot-bar]')!;
  const skipBtn = root.querySelector<HTMLElement>('[data-boot-skip]')!;
  const counter = { val: 0 };

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (safetyTimer) window.clearTimeout(safetyTimer);
    try {
      sessionStorage.setItem(SKIP_KEY, 'true');
    } catch {}
    tl.pause();
    tickTween.kill();
    handlers.onComplete();
  };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    paused: true,
    onComplete: finish,
  });
  let safetyTimer: number | undefined;

  // Percentage ticker
  const tickTween = gsap.to(counter, {
    val: total,
    duration: reduced ? 0.4 : 2.6,
    ease: 'power2.inOut',
    onUpdate: () => {
      const v = Math.round(counter.val);
      if (pctEl) pctEl.textContent = String(v).padStart(3, '0') + '%';
      if (barEl) barEl.style.width = v + '%';
    },
  });
  tl.add(tickTween, 0);

  // Sequential lines
  let at = 0;
  const lineDuration = reduced ? 0.04 : 0.42;
  lines.forEach((text) => {
    tl.call(() => {
      if (lineEl) lineEl.textContent = text;
    }, [], at);
    at += lineDuration;
  });

  // Flicker on the whole thing
  tl.fromTo(
    root,
    { opacity: 1 },
    {
      opacity: 0.55,
      duration: reduced ? 0.05 : 0.18,
      repeat: 2,
      yoyo: true,
      ease: 'none',
    },
    at - 0.2,
  );

  skipBtn.addEventListener('click', finish);

  if (reduced) {
    if (lineEl) lineEl.textContent = 'SYSTEM READY';
    safetyTimer = window.setTimeout(finish, 400);
    return () => {
      skipBtn.removeEventListener('click', finish);
      if (safetyTimer) window.clearTimeout(safetyTimer);
    };
  }

  tl.play();

  // Safety fallback in case rAF is throttled (e.g. background tab).
  safetyTimer = window.setTimeout(finish, 3800);

  return () => {
    skipBtn.removeEventListener('click', finish);
    if (safetyTimer) window.clearTimeout(safetyTimer);
    tl.kill();
    tickTween.kill();
  };
}
