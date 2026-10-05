import type { APIRoute } from 'astro';
import { getDb } from '@/server/db';
import { getSession } from '@/server/auth';

export const prerender = false;

export const PUT: APIRoute = async ({ request, url }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const kind = url.searchParams.get('kind') || 'home';
  const allowed = new Set(['home','about','contact','brand','seo']);
  if (!allowed.has(kind)) return new Response('Bad', { status: 400 });
  const b = await request.json();
  const db = getDb();
  const st = db.prepare('UPDATE home SET value=? WHERE key=?'); // placeholder
  // use proper table
  const table = kind as 'home'|'about'|'contact'|'brand'|'seo';
  const stmt = db.prepare(`UPDATE ${table} SET value=? WHERE key=?`);
  for (const k of Object.keys(b)) stmt.run(String(b[k]), k);
  return new Response(JSON.stringify({ ok: true }));
};
