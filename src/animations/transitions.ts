import gsap from 'gsap';
import { prefersReducedMotion } from './utils';

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Cinematic scene transition — a wind of leaves gusts across the screen.
 * Unlike a dark veil, the swap is masked by motion: at peak leaf density the
 * environment crossfades underneath, so there is never a black frame. Leaves
 * use three depth tiers (far/mid/near) for parallax richness.
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

  veil.replaceChildren();

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const leaves: HTMLElement[] = [];
  const tl = gsap.timeline({
    onComplete: () => leaves.forEach((leaf) => leaf.remove()),
  });

  const depths = [
    { size: [8, 14], opacity: [0.2, 0.4], dur: [0.9, 1.25], blur: 1.2 },
    { size: [18, 28], opacity: [0.35, 0.6], dur: [0.75, 1.05], blur: 0.6 },
    { size: [32, 48], opacity: [0.6, 0.85], dur: [0.6, 0.9], blur: 0 },
  ];

  const total = 26;
  for (let i = 0; i < total; i++) {
    const tier = depths[i % depths.length];
    const size = rand(tier.size[0], tier.size[1]);
    const opacity = rand(tier.opacity[0], tier.opacity[1]);
    const dur = rand(tier.dur[0], tier.dur[1]);
    const enter = rand(0.0, 0.2);

    const leaf = document.createElement('span');
    leaf.className = 'wind-leaf';
    leaf.style.cssText = [
      `position:absolute`,
      `top:${rand(-0.1, 1.05) * vh}px`,
      `width:${size}px`,
      `height:${size}px`,
      `opacity:${opacity}`,
      `filter:blur(${tier.blur}px)`,
      `background:url('/assets/leaves/leaf.svg') 50% 50% / 100% 100% no-repeat`,
      `will-change:transform`,
    ].join(';');
    veil.appendChild(leaf);
    leaves.push(leaf);

    const driftY = rand(-40, 40);
    const spin = rand(360, 900) * (Math.random() < 0.5 ? -1 : 1);

    tl.fromTo(
      leaf,
      { x: -size, rotation: -spin * 0.4 },
      {
        x: vw + size + rand(0, 60),
        y: driftY,
        rotation: spin,
        duration: dur,
        ease: 'power1.inOut',
      },
      enter,
    );
  }

  let midFired = false;
  tl.add(() => {
    if (!midFired) {
      midFired = true;
      onMid();
    }
  }, 0.45);

  return () => {
    tl.kill();
    leaves.forEach((leaf) => leaf.remove());
  };
}