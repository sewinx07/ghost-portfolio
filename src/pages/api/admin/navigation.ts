import type { APIRoute } from 'astro';
import { getDb } from '@/server/db';
import { getSession } from '@/server/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const b = await request.json();
  const db = getDb();
  db.prepare('INSERT INTO navigation (ref,label,position,visible) VALUES (?,?,?,?)').run(String(b.ref), String(b.label), Number(b.position)||0, b.visible?1:0);
  return new Response(JSON.stringify({ ok: true }));
};

export const PUT: APIRoute = async ({ request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const rows = await request.json() as any[];
  const db = getDb();
  const st = db.prepare('UPDATE navigation SET ref=?,label=?,position=?,visible=? WHERE id=?');
  for (const r of rows) st.run(r.ref, r.label, Number(r.position)||0, r.visible?1:0, Number(r.id));
  return new Response(JSON.stringify({ ok: true }));
};
