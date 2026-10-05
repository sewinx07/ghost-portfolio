import type { APIRoute } from 'astro';
import { getDb } from '@/server/db';
import { getSession } from '@/server/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const b = await request.json();
  const db = getDb();
  db.prepare('INSERT INTO contributors (name,role,url) VALUES (?,?,?)').run(b.name, b.role||'', b.url||'');
  return new Response(JSON.stringify({ ok: true }));
};

export const DELETE: APIRoute = async ({ url, request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const id = url.searchParams.get('id');
  if (!id) return new Response('Bad', { status: 400 });
  const db = getDb();
  db.prepare('DELETE FROM contributors WHERE id=?').run(Number(id));
  return new Response(JSON.stringify({ ok: true }));
};
