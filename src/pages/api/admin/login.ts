import { verifyPassword, setSession, clearSession, getSession } from '@/server/auth';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const password = body.password?.toString() || '';
  if (!verifyPassword(password)) {
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }
  const res = new Response(JSON.stringify({ ok: true }));
  return setSession(res, true);
};

export const GET: APIRoute = async ({ request }) => {
  const sess = getSession(request);
  return new Response(JSON.stringify({ ok: !!sess?.authenticated }));
};

export const DELETE: APIRoute = async () => {
  const res = new Response(JSON.stringify({ ok: true }));
  return clearSession(res);
};
