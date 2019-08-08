const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtensionReloader  = require("webpack-extension-reloader");

const mode = process.env.NODE_ENV;

module.exports = {
  mode,
  devtool: "inline-source-map",
  entry: {
    background: './src/background.js',
    content: './src/content.js'
  },
  output: {
    publicPath: ".",
    path: resolve(__dirname, "dist/"),
    filename: "[name].js"
  },
  plugins: [
    new ExtensionReloader({
      port: 9123,
      reloadPage: true,
      manifest: resolve(__dirname, "./src/manifest.json")
    }),
    new CopyWebpackPlugin([
      { from: "./src/manifest.json" },
      { from: "./src/icons", to:'icons/' }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [require("@babel/preset-env")]
          }
        }
      }
    ]
  }
}
