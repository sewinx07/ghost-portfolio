import type { MiddlewareHandler } from 'astro';
import { getSession } from './auth';
import { getDb } from './db';

const maintenancePaths = new Set(['/admin', '/api/admin']);
const apiPaths = new Set(['/api/admin/login']);

export const onRequest: MiddlewareHandler = async (context, next) => {
  const db = getDb();
  const srow = db.prepare('SELECT value FROM settings WHERE key=?').get('maintenance') as any;
  const isMaintenance = srow && srow.value === 'true';

  const { url, request } = context;

  // Allow admin login API
  if (url.pathname.startsWith('/api/admin/login')) {
    return next();
  }

  // Allow /admin pages to be checked by middleware but we can block non-logged-in
  if (url.pathname.startsWith('/admin')) {
    const sess = getSession(request);
    if (!sess || !sess.authenticated) {
      return new Response(null, { status: 302, headers: { Location: '/admin/login' } });
    }
    return next();
  }

  // Allow all /api/admin except login is handled; protect others
  if (url.pathname.startsWith('/api/admin')) {
    const sess = getSession(request);
    if (!sess || !sess.authenticated) {
      return new Response('Unauthorized', { status: 401 });
    }
    return next();
  }

  // Maintenance mode: block everything except /admin, /api/admin, and the maintenance page itself
  if (isMaintenance) {
    // Never block admin flow
    return next();
  }

  return next();
};
