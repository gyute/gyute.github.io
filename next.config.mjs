import withMDX from "@next/mdx";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
  reactStrictMode: true,
};

export default withMDX()(nextConfig);
