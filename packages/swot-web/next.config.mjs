/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// await import("@/env.mjs")

import webpack from "webpack"

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,

  distDir: process.env.DIST ?? ".next",

  experimental: {
    // 支持 自己的 esm package 导入（比如 @cs-magic/next-auth）
    // ref: https://nextjs.org/docs/messages/import-esm-externals
    esmExternals: 'loose'
  },

  webpack(config, { dev, isServer }) {
    // 以下是gpt给的，为了解决wechaty的问题，但没用，无法启动
    // if (!isServer) {
    //   config.node = {
    //     fs: false,
    //     net: false,
    //     tls: false,
    //   }
    // }
    // config.module.rules.push({
    //   test: /\.cjs$/,
    //   type: "javascript/auto",
    // })

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    // ref: https://stackoverflow.com/a/70573610/9422455
    config.experiments.asyncWebAssembly = true

    // ref:
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /any-promise/,
        /node_modules\/any-promise\/register\.js$/,
      ),
    )

    return config
  },

  // ref: https://nextjs.org/docs/api-reference/next/image#remote-patterns
  images: {
    // 如果不优化的话，图片无法导出，会有cors问题
    // unoptimized: true,

    remotePatterns: [
      // ref:https://stackoverflow.com/a/73951135/9422455
      { protocol: "http", hostname: "**" },
      { protocol: "https", hostname: "**" },
    ],
  },

  // ref: https://jotai.org/docs/tools/devtools#next-js-setup
  transpilePackages: ["jotai-devtools"],

  // ref: https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs
  async redirects() {
    return [
      // {
      //   source: "/",
      //   destination: "/tt",
      //   permanent: false,
      // },
    ]
  },
}

export default config