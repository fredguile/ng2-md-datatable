const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const webpackAngularExternals = require("webpack-angular-externals");
const webpackRxJsExternals = require("webpack-rxjs-externals");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const stripIndent = require("common-tags").stripIndent;

const pkg = JSON.parse(fs.readFileSync("./package.json").toString());

module.exports = {
  entry: {
    "ng2-md-datatable.umd": "./tmp/es5/ng2-md-datatable.es5.js",
    "ng2-md-datatable.umd.min": "./tmp/es5/ng2-md-datatable.es5.js"
  },
  output: {
    path: path.join(__dirname, "/dist/bundles"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "ng2-md-datatable"
  },
  externals: [webpackAngularExternals(), webpackRxJsExternals()],
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.json$/,
        use: "json-loader"
      },
      {
        test: /\.css$/,
        use: ["to-string-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["to-string-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.html$/,
        use: "raw-loader"
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: stripIndent`
        /**
         * ${pkg.name} - ${pkg.description}
         * @version v${pkg.version}
         * @author ${pkg.author.name}
         * @link ${pkg.homepage}
         * @license ${pkg.license}
         */
        `,
      raw: true,
      entryOnly: true
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        sourceMap: true,
      })
    ]
  }
};
