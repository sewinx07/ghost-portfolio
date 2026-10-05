import type { APIContext, MiddlewareResponseHandler } from 'astro';
import bcrypt from 'bcryptjs';
import { config, adminPasswordIsHash } from './config';

const SESSION_COOKIE = config.sessionCookie;

export interface Session {
  authenticated: boolean;
  expires: number;
}

export function getSession(request: Request): Session | null {
  const cookie = request.headers.get('cookie');
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  try {
    const s = JSON.parse(Buffer.from(match[1], 'base64url').toString('utf8')) as Session;
    if (s.authenticated && s.expires > Date.now()) return s;
  } catch {}
  return null;
}

export function setSession(response: Response, authenticated: boolean): Response {
  const s: Session = {
    authenticated,
    expires: Date.now() + config.sessionMaxAge * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(s)).toString('base64url');
  response.headers.set(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encoded}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${config.sessionMaxAge};${config.isProd ? ' Secure;' : ''}`,
  );
  return response;
}

export function clearSession(response: Response): Response {
  response.headers.set(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  );
  return response;
}

export function verifyPassword(password: string): boolean {
  if (adminPasswordIsHash()) {
    return bcrypt.compareSync(password, config.adminPassword);
  }
  // dev plaintext fallback
  return password === config.adminPassword;
}
