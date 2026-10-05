import { getSession } from './server/auth';
import { getDb } from './server/db';
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const db = getDb();
  const srow = db.prepare('SELECT value FROM settings WHERE key=?').get('maintenance') as any;
  const isMaintenance = srow && srow.value === 'true';

  const { url, request } = context;

  if (url.pathname.startsWith('/api/admin/login')) return next();
  if (url.pathname.startsWith('/admin')) {
    const sess = getSession(request);
    if (!sess?.authenticated) return new Response(null, { status: 302, headers: { Location: '/admin/login' } });
    return next();
  }
  if (url.pathname.startsWith('/api/admin')) {
    const sess = getSession(request);
    if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
    return next();
  }
  if (isMaintenance) {
    if (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/assets/')) return next();
    return new Response(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>SEWINX — Under Maintenance</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&family=Space+Mono:wght@400;500&display=swap" rel="stylesheet"/>
        <style>:root{--ink:#0b0806;--bone:#e8dfd0;--mist:#cfc4b2;--mono:'Space Mono';--display:'Plus Jakarta Sans'}*{margin:0;padding:0;box-sizing:border-box}body{background:#0b0806;color:var(--mist);font-family:var(--mono);min-height:100dvh;display:grid;place-items:center;text-align:center;line-height:1.7;padding:2rem}h1{color:var(--bone);font-family:var(--display);letter-spacing:.08em;text-transform:uppercase;margin-bottom:.75rem}p{max-width:420px}</style>
      </head><body><main><h1>UNDER MAINTENANCE</h1><p>The system is currently undergoing scheduled maintenance.</p></main></body></html>`,
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }
  return next();
};
