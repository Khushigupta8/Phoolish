import { spawnSync } from 'node:child_process';
import { copyFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const result = spawnSync(process.execPath, ['scripts/run-framework.mjs', 'build'], {
  stdio: 'inherit',
  env: process.env,
});
if (result.status !== 0) process.exit(result.status ?? 1);
// A supervised preview may retain deleted temporary public files in its mirror.
// Audit harnesses must never be distributed in a production build.
const publicOutput = 'dist/client';
if (existsSync(publicOutput)) {
  for (const name of readdirSync(publicOutput)) {
    if (/^qa-.*\.html$/.test(name)) rmSync(join(publicOutput, name));
  }
}

// Wrangler resolves `.dev.vars` next to its config file, which the build
// regenerates under dist/server. Carry the project-root copy across so
// `pnpm start` sees ADMIN_PASSWORD. Never committed; see .gitignore.
if (existsSync('.dev.vars') && existsSync('dist/server')) {
  copyFileSync('.dev.vars', join('dist/server', '.dev.vars'));
}
