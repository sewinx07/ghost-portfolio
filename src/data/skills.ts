export interface SkillGroup {
  title: string;
  skills: { name: string }[];
}

/**
 * Skill System — ordered by craft.
 * These are visual representations of real capabilities; no fake percentages.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Development',
    skills: [
      { name: 'TypeScript' },
      { name: 'Astro' },
      { name: 'JavaScript' },
      { name: 'HTML & CSS' },
    ],
  },
  {
    title: 'Design',
    skills: [
      { name: 'Art Direction' },
      { name: 'UI / UX' },
      { name: 'Design Systems' },
    ],
  },
  {
    title: 'Motion',
    skills: [{ name: 'GSAP' }, { name: 'ScrollTrigger' }, { name: 'Timelines' }],
  },
  {
    title: 'Tools',
    skills: [{ name: 'Git' }, { name: 'Node.js' }, { name: 'Figma' }],
  },
];
