import { getSession } from './server/auth';
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
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
  return next();
};
