import { defineConfig } from "tsup"

const isDev = process.env["NODE_ENV"] === "development"

export default defineConfig({
  clean: isDev ? false : true,
  minify: !isDev,
  sourcemap: isDev,
  splitting: false,
  treeshake: !isDev,
  format: ["cjs", "esm"],

  dts: {
    compilerOptions: {
      composite: false,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      // --experimentalDecorators --emitDecoratorMetadata
    },
  },

  entry: ["src/**/*"],
})
