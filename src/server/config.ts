/**
 * Runtime configuration for the master dashboard.
 *
 * Everything here is server-only. In development we fall back to safe local
 * defaults so the site and dashboard boot with zero setup; in production the
 * values MUST come from the environment.
 */

const isProd = import.meta.env.PROD;

/** Throws in production when a required secret is missing. */
function required(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  if (isProd) {
    throw new Error(
      `[config] Missing required environment variable ${name}. ` +
        `Set it before starting the production server.`,
    );
  }
  return devFallback;
}

/** Optional with a development fallback that is never used in production. */
function optional(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  if (isProd) {
    throw new Error(
      `[config] Missing required environment variable ${name}. ` +
        `Set it before starting the production server.`,
    );
  }
  return devFallback;
}

/**
 * The admin password. Preferred form is a bcrypt hash so the plaintext never
 * exists in the environment: `node scripts/hash-password.mjs`.
 * A plaintext value is accepted only for local development convenience.
 */
function adminPassword(): string {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash && hash.startsWith('$2')) return hash;

  const plain = process.env.ADMIN_PASSWORD;
  if (plain) {
    if (isProd) {
      throw new Error(
        '[config] ADMIN_PASSWORD must be a bcrypt hash in production. ' +
          'Generate one with: node scripts/hash-password.mjs',
      );
    }
    return plain;
  }

  if (isProd) {
    throw new Error(
      '[config] Set ADMIN_PASSWORD_HASH (bcrypt) to enable the dashboard.',
    );
  }
  // Local development default. Documented in .env.example.
  return 'sewinx-dev';
}

/** True when the configured admin password is a bcrypt hash. */
export const adminPasswordIsHash = (): boolean =>
  adminPassword().startsWith('$2');

export const config = {
  /** Path to the SQLite database file. */
  databasePath: optional('DATABASE_PATH', './data/sewinx.db'),
  /** bcrypt hash (or dev plaintext) of the single-owner admin password. */
  adminPassword: adminPassword(),
  /** Secret used to sign session cookies. */
  sessionSecret: required('SESSION_SECRET', 'sewinx-dev-session-secret-change-me'),
  /** Session lifetime in seconds (default 7 days). */
  sessionMaxAge: Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 24 * 7),
  /** Cookie name for the admin session. */
  sessionCookie: 'sewinx_admin',
  isProd,
};
