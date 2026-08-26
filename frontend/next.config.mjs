/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint errors will be shown as warnings during build but won't fail it.
    // This prevents false positives from crashing Vercel deployments.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript errors are caught by tsc --noEmit in CI separately.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
