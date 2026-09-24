export interface Project {
  title: string;
  slug: string;
  category: string;
  year: string;
  role: string;
  technologies: string[];
  thumbnail: string;
  image?: string;
  featured?: boolean;
  link?: string;
  source?: string;
  overview: string;
  process: string;
  features: string[];
  result: string;
}

/**
 * Central project database.
 *
 * Only real information is included. Projects without complete details use
 * clearly marked placeholder copy so nothing is fabricated.
 */
export const PROJECTS: Project[] = [
  {
    title: 'LERNIO',
    slug: 'lernio',
    category: 'Language Learning Platform',
    year: '—',
    role: 'Creative Developer',
    technologies: ['Astro', 'TypeScript', 'GSAP', 'Accessibility'],
    thumbnail: '/assets/environments/projects-forge.png',
    image: '/assets/environments/projects-forge.png',
    featured: true,
    link: '',
    source: '',
    overview:
      'A cinematic language learning platform concept. This entry is a placeholder pending the real project details.',
    process:
      'Designed to place calm, deliberate motion at the heart of the learning experience so progress feels like a journey rather than a task list.',
    features: [
      'Cinematic onboarding sequence',
      'Lesson progress timeline',
      'Responsive, touch-first layouts',
    ],
    result:
      'Details to be completed. Reduce motion and accessibility are prioritized throughout.',
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeatured(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}
