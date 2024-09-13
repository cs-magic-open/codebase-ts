const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./src/core/main.js",
    iframe: "./src/core/iframe.js",
  },
  output: {
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        // exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
};
