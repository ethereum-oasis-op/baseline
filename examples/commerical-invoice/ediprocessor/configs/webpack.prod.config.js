"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  mode: "production",
  entry: [path.join(__dirname, "../src/app/main.js")],
  output: {
    path: path.join(__dirname, "../dist/app/"),
    filename: "[name].js",
    publicPath: "/",
  },
  resolve: {
    alias: {
      "common-tools": path.resolve(__dirname, "../src/app/Tools/"),
      "common-views": path.resolve(__dirname, "../src/app/Views/"),
      "common-controls": path.resolve(__dirname, "../src/app/Controls"),
      "common-data": path.resolve(__dirname, "../src/app/Data"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "../../src/app/index.tpl.html",
      inject: "body",
      filename: "index.html",
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "production",
    }),
    new WriteFilePlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "> 0.25%, not dead",
                },
              ],
              "@babel/preset-react",
            ],
            plugins: [
              "@babel/plugin-syntax-dynamic-import",
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
