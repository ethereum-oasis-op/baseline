"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  devtool: "source-map",
  mode: "development",
  entry: [
    "react-hot-loader/patch",
    "webpack-hot-middleware/client",
    path.join(__dirname, "../src/app/main.js"),
  ],
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
      template: "src/app/index.tpl.html",
      inject: "body",
      filename: "index.html",
    }),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development", // use 'development' unless process.env.NODE_ENV is defined
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
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
