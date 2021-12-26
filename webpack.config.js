const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ROOT = path.resolve(__dirname, "src");
const DESTINATION = path.resolve(__dirname, "dist");
const TEMPLATE = path.join(__dirname, "template/index.html")

module.exports = {
  context: ROOT,

  entry: {
    main: "./main.ts",
  },

  output: {
    filename: "[name].bundle.js",
    path: DESTINATION,
  },

  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: "ts-loader",
      },
    ],
  },
  devServer: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: TEMPLATE,
    }),
  ],
};
