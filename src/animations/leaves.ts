import gsap from 'gsap';
import { prefersReducedMotion } from './utils';

export interface LeafStyle {
  depth: 'far' | 'mid' | 'near';
  count: number;
}

/**
 * Creates animated maple leaves within a container.
 * Each leaf gets randomized behavior; multi-depth layers drive parallax feel.
 */
export function createLeaves(
  container: HTMLElement,
  opts: LeafStyle,
): () => void {
  const reduced = prefersReducedMotion();
  const leaves: HTMLElement[] = [];

  const conf = {
    far: { size: [8, 16], dur: [14, 26], opacity: [0.15, 0.35], blur: 0 },
    mid: { size: [18, 34], dur: [11, 20], opacity: [0.3, 0.6], blur: 0.5 },
    near: { size: [30, 60], dur: [8, 16], opacity: [0.5, 0.85], blur: 1.5 },
  }[opts.depth];

  for (let i = 0; i < opts.count; i++) {
    const leaf = document.createElement('span');
    leaf.className = 'leaf';
    const size = rand(conf.size[0], conf.size[1]);
    const left = rand(-5, 105);
    leaf.style.cssText = `
      --leaf-size: ${size}px;
      left: ${left}%;
      top: ${rand(-10, 110)}%;
      filter: blur(${conf.blur}px);
      opacity: ${rand(conf.opacity[0], conf.opacity[1])};
      background-image: url("/assets/leaves/leaf.svg");
    `;
    container.appendChild(leaf);
    leaves.push(leaf);
  }

  if (reduced) {
    return () => {
      leaves.forEach((l) => l.remove());
    };
  }

  const tweens = leaves.map((leaf) => {
    const dur = rand(conf.dur[0], conf.dur[1]);
    const drift = rand(-18, 18);
    return gsap.fromTo(
      leaf,
      { y: `${rand(-10, 110)}vh`, x: 0, rotation: rand(-180, 180) },
      {
        y: `${rand(-120, -10)}vh`,
        x: drift,
        rotation: `+=${rand(360, 720)}`,
        duration: dur,
        ease: 'none',
        repeat: -1,
        // random delay so leaves don't start in sync
        delay: rand(0, dur),
      },
    );
  });

  return () => {
    tweens.forEach((t) => t.kill());
    leaves.forEach((l) => l.remove());
  };
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
