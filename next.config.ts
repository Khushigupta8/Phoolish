import path from 'node:path';
import type { NextConfig } from 'next';

// `cloudflare:workers` only exists under the Workers runtime. The `*:next`
// scripts run plain Next.js, which cannot resolve it, so those runs alias it to
// a stub that exposes no bindings — the storefront then falls back to the seed
// catalogue in `data/products.ts` and /admin reports that storage is missing.
//
// The alias is deliberately NOT applied by default: vinext reads this same
// config for `pnpm dev` / `pnpm build`, and stubbing the module there would
// silently disable D1 and R2.
const standardNext = (process.env.npm_lifecycle_event ?? '').endsWith(':next');
const cloudflareStub = path.resolve('./lib/cloudflare-stub.ts');

const nextConfig: NextConfig = {
  // Keep standard Next output separate from the hosting adapter's generated types.
  distDir: '.next-standard',
  ...(standardNext
    ? {
        turbopack: {
          resolveAlias: { 'cloudflare:workers': './lib/cloudflare-stub.ts' },
        },
        webpack: (config: { resolve: { alias?: Record<string, string> } }) => {
          config.resolve.alias = {
            ...config.resolve.alias,
            'cloudflare:workers': cloudflareStub,
          };
          return config;
        },
      }
    : {}),
};

export default nextConfig;
