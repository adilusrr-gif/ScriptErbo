import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/export/pdf": ["./src/lib/pdf/fonts/**"],
  },
};

export default nextConfig;
