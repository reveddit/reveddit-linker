const webpack = require("webpack")
const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtensionReloader  = require("webpack-extension-reloader");
const COMMON = require("./webpack.common.js")

const mode = process.env.NODE_ENV;
const distFolder = COMMON.getDistFolderName(mode, process.env.FORCHROME, process.env.FORFIREFOX)
const distPath = path.join(__dirname, distFolder)
const distLibPath = path.join(distPath, 'lib')

const manifestPath = path.resolve(__dirname, "./src/manifest.json")

let built_for = '"chrome"'
if (process.env.FORFIREFOX) {
    built_for = '"firefox"'
}

function modify(buffer) {
    // copy-webpack-plugin passes a buffer
    // this line, buffer.toString(), causes this error if this filename ends in babel.js:
    //     Cannot find module 'core-js/modules/es.object.to-string'
    // maybe babel converts it incorrectly?
    var manifest = JSON.parse(buffer.toString());
    if (process.env.FORFIREFOX) {
        let id = 'linker-stable@reveddit.com'
        manifest.browser_specific_settings = {
            "gecko": { id }
        }
        delete manifest.host_permissions
        manifest.permissions.push("activeTab")
        manifest.manifest_version = 2
        manifest.background.scripts = [manifest.background.service_worker]
        delete manifest.background.service_worker
        delete Object.assign(manifest, {browser_action: manifest.action }).action
    }
    // pretty print to JSON with two spaces
    return JSON.stringify(manifest, null, 2);
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
      { from: "./src/manifest.json",
        to:   distPath,
        // from https://stackoverflow.com/a/54700817/2636364
        transform (content, path) {
            return modify(content)
        }
      },
      { from: "./src/icons", to:'icons/' },
      { context: 'lib/', from: "*", to: distLibPath },
      { context: 'node_modules/arrive/src/', from: 'arrive.js', to: distLibPath },
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
