export type SceneRef = 'home' | 'projects' | 'about' | 'skills' | 'experience' | 'contact';

export interface SceneAssets {
  environment: string;
  character?: string;
  /**
   * Cinematic color grade applied to the environment image.
   * Derived from each scene's measured lighting (temperature, brightness,
   * contrast) so every world is individually art-directed rather than
   * receiving one universal filter.
   */
  grade: string;
  /**
   * Ambient lighting overlay. A subtle gradient that reinforces the scene's
   * dominant light direction (top-lit canopies, bottom-heavy dusk, cool
   * moonlit haze) so the image reads as one lit space.
   */
  light: string;
  /**
   * Atmospheric glow that breathes very slowly over the scene's light source
   * (sun, moon, storm glow). x/y are percentages across the canvas; the layer
   * is a soft radial glow that gently varies in opacity so sunlight feels
   * physically present without being noticed as an effect.
   */
  sun?: { x: string; y: string; color: string; size: string };
  label: string;
  number: string;
}

/**
 * Centralized asset manifest.
 *
 * Source images were mapped to the six cinematic worlds as follows:
 *  - HOME       -> Sunset.png (coastal warm sunset) + bg1 character
 *  - PROJECTS   -> Bamboo forest.png
 *  - ABOUT      -> Moonlit.png
 *  - SKILLS     -> Forest.png with a storm-blue cinematic overlay
 *  - EXPERIENCE -> Forest.png (misty mountain path / journey)
 *  - CONTACT    -> Sunset.png with a dusk overlay
 *
 * All paths are Astro public-relative and resolved at the bundle root.
 */
const base = '/assets/';

export const SCENES: Record<SceneRef, SceneAssets> = {
  home: {
    environment: `${base}characters/taha-home.png`,
    grade: 'brightness(1.06) saturate(1.1) contrast(1.06)',
    light:
      'radial-gradient(ellipse 55% 48% at 51% 45%, rgba(255,214,150,0.30), rgba(255,180,105,0.08) 55%, rgba(10,6,3,0) 78%), linear-gradient(200deg, rgba(15,8,3,0.05), rgba(2,1,0,0.62))',
    sun: { x: '51%', y: '45%', color: 'rgba(255,216,158,0.55)', size: '48%' },
    label: 'The Beginning',
    number: '01',
  },
  projects: {
    environment: `${base}environments/projects-forge.png`,
    grade: 'brightness(1.04) saturate(1.06) contrast(1.08)',
    light:
      'radial-gradient(ellipse 52% 40% at 50% 20%, rgba(235,220,150,0.24), rgba(210,190,120,0.06) 55%, rgba(6,8,3,0) 80%), linear-gradient(180deg, rgba(12,16,6,0.04), rgba(3,5,2,0.68))',
    sun: { x: '50%', y: '20%', color: 'rgba(240,220,150,0.5)', size: '44%' },
    label: 'The Forge',
    number: '02',
  },
  about: {
    environment: `${base}environments/about-moonlit.png`,
    grade: 'brightness(0.94) contrast(1.09) saturate(0.96) hue-rotate(6deg)',
    light:
      'radial-gradient(ellipse 50% 42% at 51% 22%, rgba(160,190,235,0.28), rgba(120,150,200,0.07) 55%, rgba(4,7,18,0) 80%), linear-gradient(180deg, rgba(6,10,26,0.12), rgba(3,5,12,0.6))',
    sun: { x: '51%', y: '22%', color: 'rgba(175,205,250,0.46)', size: '42%' },
    label: 'The Inner World',
    number: '03',
  },
  skills: {
    environment: `${base}environments/skills-storm.png`,
    grade: 'contrast(1.16) saturate(0.7) brightness(0.9)',
    light:
      'radial-gradient(ellipse 48% 44% at 60% 38%, rgba(120,140,190,0.26), rgba(80,95,140,0.06) 55%, rgba(12,16,30,0) 78%), linear-gradient(150deg, rgba(8,12,26,0.02), rgba(6,8,18,0.66))',
    sun: { x: '60%', y: '38%', color: 'rgba(125,148,205,0.46)', size: '52%' },
    label: 'The Elements',
    number: '04',
  },
  experience: {
    environment: `${base}environments/experience-journey.png`,
    grade: 'brightness(1.08) saturate(0.82) contrast(0.98)',
    light:
      'radial-gradient(ellipse 60% 50% at 60% 38%, rgba(220,228,212,0.20), rgba(24,30,26,0) 62%), linear-gradient(180deg, rgba(14,18,16,0.04), rgba(6,9,8,0.5))',
    label: 'The Journey',
    number: '05',
  },
  contact: {
    environment: `${base}environments/contact-summit.png`,
    grade: 'brightness(1.05) saturate(1.22) contrast(1.08) sepia(0.1)',
    light:
      'radial-gradient(ellipse 56% 50% at 38% 54%, rgba(255,190,110,0.34), rgba(255,150,70,0.08) 56%, rgba(34,12,5,0) 80%), linear-gradient(150deg, rgba(70,24,10,0.08), rgba(20,7,3,0.62))',
    sun: { x: '38%', y: '54%', color: 'rgba(255,196,120,0.6)', size: '46%' },
    label: 'The Destination',
    number: '06',
  },
};

export const SCENE_ORDER: SceneRef[] = [
  'home',
  'projects',
  'about',
  'skills',
  'experience',
  'contact',
];
