import type { APIRoute } from 'astro';
import { getDb } from '@/server/db';
import { getSession } from '@/server/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const db = getDb();
  const rows = db.prepare('SELECT key,value FROM settings').all() as any[];
  const out: Record<string,string> = {};
  for (const r of rows) out[r.key]=r.value;
  return new Response(JSON.stringify(out));
};

export const PUT: APIRoute = async ({ request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const body = await request.json();
  const db = getDb();
  const stmt = db.prepare('UPDATE settings SET value=? WHERE key=?');
  for (const k of Object.keys(body)) {
    stmt.run(String(body[k]), k);
  }
  return new Response(JSON.stringify({ ok: true }));
};
