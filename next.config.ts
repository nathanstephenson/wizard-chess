import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        reactCompiler: true
    },
    transpilePackages: ["three"]
}

export default nextConfig;
