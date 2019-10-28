const webpack = require("webpack")
const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtensionReloader  = require("webpack-extension-reloader");
const COMMON = require("./webpack.common.js")

const mode = process.env.NODE_ENV;
const distFolder = COMMON.getDistFolderName(mode, process.env.FORCHROME, process.env.FORFIREFOX)
const distPath = path.join(__dirname, distFolder)

const manifestPath = path.resolve(__dirname, "./src/manifest.json")

let built_for = '"chrome"'
if (process.env.FORFIREFOX) {
    built_for = '"firefox"'
}

module.exports = {
  mode,
  devtool: "inline-source-map",
  entry: {
    background: './src/background.js',
    content: './src/content.js'
  },
  output: {
    path: distPath,
    filename: "[name].js"
  },
  plugins: [
    new ExtensionReloader({
      port: 9123,
      reloadPage: true,
      manifest: manifestPath
    }),
    new CopyWebpackPlugin([
      { from: "./src/manifest.json" },
      { from: "./src/icons", to:'icons/' }
    ]),
    new webpack.DefinePlugin({
      __BUILT_FOR__: built_for
    })
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
