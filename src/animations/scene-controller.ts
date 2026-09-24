import gsap from 'gsap';
import { SCENES, SCENE_ORDER, type SceneRef } from '../data/assets';
import { playSceneTransition } from './transitions';
import { prefersReducedMotion } from './utils';

export interface MenuItem {
  ref: SceneRef;
  label: string;
}

interface SceneControllerOptions {
  sceneRoot: HTMLElement;
  menuRoot: HTMLElement;
  veilRoot: HTMLElement;
  hudSection: HTMLElement | null;
  hudIndex: HTMLElement | null;
  onSceneChange?: (scene: SceneRef) => void;
}

/**
 * Manages the six-scene cinematic navigation on the home page.
 * Handles menu selection, keyboard nav, transitions and HUD updates.
 */
export function createSceneController(
  items: MenuItem[],
  opts: SceneControllerOptions,
): () => void {
  const reduced = prefersReducedMotion();
  let current: SceneRef = 'home';
  let activeIndex = 0;
  const menuButtons = Array.from(
    opts.menuRoot.querySelectorAll<HTMLButtonElement>('[data-menu-item]'),
  );

  const setActiveRing = (idx: number) => {
    menuButtons.forEach((b, i) => {
      b.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      b.classList.toggle('is-active', i === idx);
    });
  };

  let transitionKill: (() => void) | null = null;

  const switchTo = (ref: SceneRef, instant = false) => {
    if (ref === current && !instant) return;
    current = ref;

    const idx = SCENE_ORDER.indexOf(ref);
    activeIndex = idx;
    setActiveRing(idx);

    const scene = SCENES[ref];
    if (opts.hudSection)
      opts.hudSection.textContent = scene.label.toUpperCase();
    if (opts.hudIndex)
      opts.hudIndex.textContent = `0${idx + 1} / 06`;

    if (instant || reduced) {
      applyScene(ref);
      opts.onSceneChange?.(ref);
      return;
    }

    // Cancel any transition still in flight so rapid clicks never queue
    transitionKill?.();
    transitionKill = playSceneTransition(opts.veilRoot, {
      onMid: () => {
        // Both the environment and the content layer resolve under full
        // veil cover — nothing is ever visible mid-swap.
        applyScene(ref);
        opts.onSceneChange?.(ref);
      },
    });
  };

  const applyScene = (ref: SceneRef) => {
    const scene = SCENES[ref];
    opts.sceneRoot.dataset.scene = ref;

    // Swap environment image + tint/grade
    const img = opts.sceneRoot.querySelector<HTMLImageElement>('[data-env-img]');
    const tint = opts.sceneRoot.querySelector<HTMLElement>('[data-env-tint]');
    const bg = opts.sceneRoot.querySelector<HTMLElement>('[data-env-layer]');
    if (img && img.dataset.src !== scene.environment) {
      img.dataset.src = scene.environment;
      img.src = scene.environment;
    }
    if (bg) {
      // Cinematic color grade follows the scene's lighting
      bg.style.setProperty('--grade', scene.grade);
      bg.style.setProperty('--light', scene.light);
    }
    if (tint) {
      tint.style.background = scene.light;
    }

    // Atmospheric light source (sun/moon/storm glow) follows the scene
    const sun = opts.sceneRoot.querySelector<HTMLElement>('[data-sun]');
    if (scene.sun) {
      if (sun) {
        sun.style.setProperty('--sx', scene.sun.x);
        sun.style.setProperty('--sy', scene.sun.y);
        sun.style.setProperty('--sc', scene.sun.color);
        sun.style.setProperty('--ss', scene.sun.size);
        sun.style.removeProperty('display');
      }
    } else if (sun) {
      sun.style.display = 'none';
    }
    if (bg) {
      gsap.fromTo(
        bg,
        { opacity: 0 },
        { opacity: 1, duration: reduced ? 0 : 0.45, ease: 'sine.inOut', overwrite: 'auto' },
      );
    }

    // Character only on home
    const character = opts.sceneRoot.querySelector<HTMLElement>('[data-character]');
    if (character) {
      gsap.to(character, {
        opacity: ref === 'home' ? 1 : 0,
        duration: reduced ? 0 : 0.6,
        ease: 'power2.inOut',
      });
    }
  };

  // Initial ring state
  setActiveRing(0);

  // Hover
  menuButtons.forEach((b, i) => {
    b.addEventListener('mouseenter', () => {
      if (i !== activeIndex) setActiveRing(i);
    });
    b.addEventListener('mouseleave', () => {
      setActiveRing(activeIndex);
    });
    b.addEventListener('click', () => {
      const ref = items[i]?.ref;
      if (ref) switchTo(ref);
    });
  });

  // Keyboard
  const onKey = (e: KeyboardEvent) => {
    const isFocusInMenu = opts.menuRoot.contains(document.activeElement);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        setActiveRing(activeIndex);
        menuButtons[activeIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        setActiveRing(activeIndex);
        menuButtons[activeIndex]?.focus();
        break;
      case 'Enter':
        if (isFocusInMenu) {
          e.preventDefault();
          const ref = items[activeIndex]?.ref;
          if (ref) switchTo(ref);
        }
        break;
      case 'Escape':
        e.preventDefault();
        switchTo('home');
        break;
    }
  };
  window.addEventListener('keydown', onKey);

  return () => {
    transitionKill?.();
    window.removeEventListener('keydown', onKey);
  };
}
