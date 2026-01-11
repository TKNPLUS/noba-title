import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // GitHub Pages用に静的出力モードにする
  images: {
    unoptimized: true, // GitHub PagesではNext.jsの画像最適化が使えないため無効化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // YouTubeのサムネイルドメインを許可
      },
    ],
  },
};

export default nextConfig;