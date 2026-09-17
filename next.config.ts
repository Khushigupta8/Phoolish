import path from 'node:path';
import type { NextConfig } from 'next';

// `cloudflare:workers` only exists under the Workers runtime. This config is
// read by two different bundlers, and only one of them can resolve it:
//
//   pnpm dev / build  -> vinext (vite) -> real module, bindings work
//   next dev / build  -> turbopack or webpack -> must be stubbed
//
// vinext puts itself in process.argv; Next's CLI and its worker children never
// do. Detecting the adapter (rather than the npm script that was run) keeps
// this correct when a host such as Vercel invokes `next build` directly.
const argv = process.argv.join('|');
const workersAdapter = /node_modules[\\/](vinext|vite)[\\/]/.test(argv);
const cloudflareStub = path.resolve('./lib/cloudflare-stub.ts');

// Vercel's Next.js builder only picks up the default `.next` directory, so the
// separate output directory is a local-checkout convenience, not a deploy one.
const onVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  // Keep standard Next output separate from the hosting adapter's generated types.
  distDir: onVercel ? '.next' : '.next-standard',
  // Never stub under the adapter: that would silently disable D1 and R2.
  ...(workersAdapter
    ? {}
    : {
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
      }),
};

export default nextConfig;
