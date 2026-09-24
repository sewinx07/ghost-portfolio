export interface Experience {
  year: string;
  role: string;
  place?: string;
  description: string;
}

/**
 * Mission Log — professional journey.
 * Placeholders are marked clearly; nothing is invented.
 */
export const EXPERIENCE: Experience[] = [
  {
    year: 'NOW',
    role: 'Creative Developer / Designer',
    description:
      'Building SEWINX — a cinematic, interactive portfolio that merges code, design and motion into a single world.',
  },
];
