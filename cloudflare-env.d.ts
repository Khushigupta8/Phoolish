declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    /** Password for the /admin area. Set in `.dev.vars` locally. */
    ADMIN_PASSWORD?: string;
    /** Signing key for the admin session cookie. Falls back to ADMIN_PASSWORD. */
    ADMIN_SESSION_SECRET?: string;
  }
}
