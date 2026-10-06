/**
 * Runtime configuration for the master dashboard.
 */

const isProd = import.meta.env.PROD;

function required(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  return devFallback;
}

function optional(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  return devFallback;
}

function adminPassword(): string {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash && hash.startsWith('$2')) return hash;
  const plain = process.env.ADMIN_PASSWORD;
  if (plain) {
    if (isProd) {
      throw new Error('[config] ADMIN_PASSWORD must be a bcrypt hash in production.');
    }
    return plain;
  }
  if (isProd) {
    // In production on Vercel, don't hard-fail during prerender/build if not set.
    // Return empty so auth can be configured via env post-deploy.
    return '';
  }
  return 'sewinx-dev';
}

export const adminPasswordIsHash = (): boolean => {
  const pw = adminPassword();
  return pw.startsWith('$2');
};

export const config = {
  databasePath: optional('DATABASE_PATH', './data/sewinx.db'),
  adminPassword: adminPassword(),
  sessionSecret: required('SESSION_SECRET', 'sewinx-dev-session-secret-change-me'),
  sessionMaxAge: Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 24 * 7),
  sessionCookie: 'sewinx_admin',
  isProd,
};
