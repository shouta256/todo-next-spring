import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {},
	images: {
		domains: ["picsum.photos"], // 許可する画像のホストを追加
	},
};

export default nextConfig;
