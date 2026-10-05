import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config';

let db: Database.Database | null = null;

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getDb() {
  if (db) return db;
  ensureDir(config.databasePath);
  db = new Database(config.databasePath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

function schema() {
  const sql = `
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  role TEXT NOT NULL,
  technologies TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  image TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  source TEXT,
  overview TEXT NOT NULL,
  process TEXT NOT NULL,
  features TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000)
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_title TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS experience (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year TEXT NOT NULL,
  role TEXT NOT NULL,
  place TEXT,
  description TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS home (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS about (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS navigation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL,
  label TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS brand (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS seo (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contributors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT,
  url TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000)
);

CREATE TRIGGER IF NOT EXISTS projects_updated_at
AFTER UPDATE ON projects
BEGIN
  UPDATE projects SET updated_at = (strftime('%s','now')*1000) WHERE id = old.id;
END;
`;
  return sql;
}

export function initDb() {
  const d = getDb();
  d.exec(schema());
  seed(d);
}

function json(val: any) {
  return JSON.stringify(val);
}

function parse<T = any>(s: string | null | undefined): T | null {
  if (!s) return null;
  try { return JSON.parse(s) as T; } catch { return null; }
}

function seed(d: Database.Database) {
  // Settings
  const st = d.prepare(
    'INSERT OR IGNORE INTO settings (key, value) VALUES (@k, @v)',
  );
  st.run({ k: 'maintenance', v: 'false' });
  st.run({ k: 'maintenance_message', v: 'The system is under maintenance.' });
  st.run({ k: 'ownership_name', v: 'Taha Gmir' });
  st.run({ k: 'ownership_site', v: 'https://sewinx.dev' });

  // Projects (seed from existing)
  const hasP = d.prepare('SELECT count(*) as c FROM projects').get() as any;
  if (hasP.c === 0) {
    const ins = d.prepare(
      `INSERT INTO projects (title,slug,category,year,role,technologies,thumbnail,image,featured,link,source,overview,process,features,result)
       VALUES (@title,@slug,@category,@year,@role,@technologies,@thumbnail,@image,@featured,@link,@source,@overview,@process,@features,@result)`,
    );
    ins.run({
      title: 'LERNIO',
      slug: 'lernio',
      category: 'Language Learning Platform',
      year: '—',
      role: 'Creative Developer',
      technologies: json(['Astro', 'TypeScript', 'GSAP', 'Accessibility']),
      thumbnail: '/assets/environments/projects-forge.png',
      image: '/assets/environments/projects-forge.png',
      featured: 1,
      link: '',
      source: '',
      overview:
        'A cinematic language learning platform concept. This entry is a placeholder pending the real project details.',
      process:
        'Designed to place calm, deliberate motion at the heart of the learning experience so progress feels like a journey rather than a task list.',
      features: json([
        'Cinematic onboarding sequence',
        'Lesson progress timeline',
        'Responsive, touch-first layouts',
      ]),
      result:
        'Details to be completed. Reduce motion and accessibility are prioritized throughout.',
    });
  }

  // Skills
  const hasS = d.prepare('SELECT count(*) as c FROM skills').get() as any;
  if (hasS.c === 0) {
    const ins = d.prepare(
      'INSERT INTO skills (group_title, position, name) VALUES (@g,@p,@n)',
    );
    const groups = [
      { g: 'Development', skills: ['TypeScript', 'Astro', 'JavaScript', 'HTML & CSS'], p: 0 },
      { g: 'Design', skills: ['Art Direction', 'UI / UX', 'Design Systems'], p: 1 },
      { g: 'Motion', skills: ['GSAP', 'ScrollTrigger', 'Timelines'], p: 2 },
      { g: 'Tools', skills: ['Git', 'Node.js', 'Figma'], p: 3 },
    ];
    groups.forEach((gr) => {
      gr.skills.forEach((n, i) => {
        ins.run({ g: gr.g, p: gr.p * 100 + i, n });
      });
    });
  }

  // Experience
  const hasE = d.prepare('SELECT count(*) as c FROM experience').get() as any;
  if (hasE.c === 0) {
    const ins = d.prepare(
      'INSERT INTO experience (year, role, place, description, position) VALUES (@y,@r,@pl,@d,@p)',
    );
    ins.run({
      y: 'NOW',
      r: 'Creative Developer / Designer',
      pl: '',
      d: 'Building SEWINX — a cinematic, interactive portfolio that merges code, design and motion into a single world.',
      p: 0,
    });
  }

  // Navigation
  const hasNav = d.prepare('SELECT count(*) as c FROM navigation').get() as any;
  if (hasNav.c === 0) {
    const ins = d.prepare(
      'INSERT INTO navigation (ref, label, position, visible) VALUES (@r,@l,@p,@v)',
    );
    [
      { r: 'home', l: 'Home', p: 0 },
      { r: 'projects', l: 'Projects', p: 1 },
      { r: 'about', l: 'About', p: 2 },
      { r: 'skills', l: 'Skills', p: 3 },
      { r: 'experience', l: 'Experience', p: 4 },
      { r: 'contact', l: 'Contact', p: 5 },
    ].forEach((x) => ins.run({ r: x.r, l: x.l, p: x.p, v: 1 }));
  }

  // Home content (migrated from HomeContent.astro)
  const hasHome = d.prepare('SELECT count(*) as c FROM home').get() as any;
  if (hasHome.c === 0) {
    const ins = d.prepare('INSERT INTO home (key, value) VALUES (@k,@v)');
    ins.run({ k: 'eyebrow', v: 'ENTER MY WORLD' });
    ins.run({ k: 'name_first', v: 'TAHA' });
    ins.run({ k: 'name_last', v: 'GMIR' });
    ins.run({ k: 'role', v: 'CREATIVE DEVELOPER · DESIGNER · ENGINEER' });
    ins.run({
      k: 'lead',
      v: 'I build cinematic interfaces where atmosphere and engineering become one. This world is the first of those experiences.',
    });
    ins.run({ k: 'cta_primary_label', v: 'VIEW PROJECT' });
    ins.run({ k: 'cta_primary_href', v: '/projects/lernio' });
    ins.run({ k: 'cta_secondary_label', v: 'ENTER THE FORGE' });
    ins.run({ k: 'cta_secondary_href', v: null }); // uses menu scroll
  }

  // About
  const hasA = d.prepare('SELECT count(*) as c FROM about').get() as any;
  if (hasA.c === 0) {
    const ins = d.prepare('INSERT INTO about (key, value) VALUES (@k,@v)');
    ins.run({ k: 'eyebrow', v: 'PLAYER PROFILE' });
    ins.run({ k: 'title', v: 'TAHA GMIR' });
    ins.run({
      k: 'profile',
      v: json([
        { label: 'CLASS', value: 'Creative Developer' },
        { label: 'SPECIALIZATION', value: 'Code × Design × Motion' },
        { label: 'ORIGIN', value: 'The SEWINX Universe' },
      ]),
    });
    ins.run({
      k: 'lead',
      v: 'I craft interactive worlds where cinematic atmosphere meets functional engineering. Every project balances beauty with precision — never animation for its own sake.',
    });
  }

  // Contact
  const hasC = d.prepare('SELECT count(*) as c FROM contact').get() as any;
  if (hasC.c === 0) {
    const ins = d.prepare('INSERT INTO contact (key, value) VALUES (@k,@v)');
    ins.run({ k: 'eyebrow', v: 'FINAL TRANSMISSION' });
    ins.run({ k: 'title', v: 'Have a project?' });
    ins.run({ k: 'title_sub', v: "Let's build something." });
    ins.run({
      k: 'links',
      v: json([
        { tag: 'EMAIL', href: 'mailto:hello@sewinx.dev', display: 'hello@sewinx.dev' },
        { tag: 'GITHUB', href: 'https://github.com/sewinx', display: 'github.com/sewinx', target: '_blank' },
        { tag: 'LINKEDIN', href: 'https://www.linkedin.com/in/sewinx', display: 'linkedin.com/in/sewinx', target: '_blank' },
      ]),
    });
    ins.run({ k: 'note', v: 'RESPONSE TIME: ASAP' });
  }

  // Brand
  const hasB = d.prepare('SELECT count(*) as c FROM brand').get() as any;
  if (hasB.c === 0) {
    const ins = d.prepare('INSERT INTO brand (key, value) VALUES (@k,@v)');
    ins.run({ k: 'eyebrow_left', v: 'ENDURE. ADAPT. CREATE.' });
    ins.run({ k: 'name', v: 'SEWINX' });
    ins.run({ k: 'role', v: 'CREATIVE DEVELOPER · DESIGNER' });
    ins.run({ k: 'system_status', v: 'SYSTEM ONLINE' });
    ins.run({ k: 'hint_keyboard', v: 'USE ↑ ↓ ENTER · ESC' });
  }

  // SEO
  const hasSeo = d.prepare('SELECT count(*) as c FROM seo').get() as any;
  if (hasSeo.c === 0) {
    const ins = d.prepare('INSERT INTO seo (key, value) VALUES (@k,@v)');
    ins.run({ k: 'title', v: 'SEWINX — Creative Developer & Designer' });
    ins.run({
      k: 'description',
      v: 'Enter the world of Taha Gmir (SEWINX) — a cinematic interactive portfolio blending code, design and motion.',
    });
    ins.run({ k: 'og_image', v: '/assets/characters/taha-home.png' });
    ins.run({ k: 'site_name', v: 'SEWINX' });
    ins.run({ k: 'theme_color', v: '#0b0806' });
  }
}

export function getSettings() {
  const d = getDb();
  const rows = d.prepare('SELECT key, value FROM settings').all() as Array<{key:string;value:string}>;
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}
