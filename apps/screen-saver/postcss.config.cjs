// postcss.config.ts
module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {}, // ref: https://tailwindcss.com/docs/using-with-preprocessors#nesting
    tailwindcss: {},
    autoprefixer: {},
  },
};
