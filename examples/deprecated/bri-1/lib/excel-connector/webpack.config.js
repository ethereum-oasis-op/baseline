/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const urlDev = "https://localhost:3000/";
const urlProd = "https://localhost:3000/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const buildType = dev ? "dev" : "prod";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: "./src/taskpane/taskpane.ts",
      commands: "./src/commands/commands.ts",
      jwtInputDialog: "./src/dialogs/jwtInputDialog.ts",
      primaryKeyDialog: "./src/dialogs/primaryKeyDialog.ts",
    },
    resolve: {
      extensions: [".css", ".ts", ".tsx", ".html", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
            test: /\.m?js$/,
            exclude: [
                /node_modules[\\/]core-js/,
                /node_modules[\\/]webpack[\\/]buildin/,
            ],
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime']
              }
            }
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-typescript']
            }
          }
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader"
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader"
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          loader: "file-loader",
          options: {
            name: '[path][name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane"],
      }),
      new CopyWebpackPlugin({
        patterns: [
        // NOTE: Don't need because use import "./taskpane.css" in taskpane.ts and ...
        // {
        //   to: "taskpane.css",
        //   from: "./src/taskpane/taskpane.css"
        // },
        {
          to: "[name]." + buildType + ".[ext]",
          from: "manifest*.xml",
          transform(content) {
            if (dev) {
              return content;
            } else {
              return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
            }
          }
        }
      ]}),
      new HtmlWebpackPlugin({
        filename: "jwtInputDialog.html",
        template: "./src/dialogs/jwtInputDialog.html",
        chunks: ["polyfill", "jwtInputDialog"]
      }),
      new HtmlWebpackPlugin({
        filename: "primaryKeyDialog.html",
        template: "./src/dialogs/primaryKeyDialog.html",
        chunks: ["polyfill", "primaryKeyDialog"]
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"]
      })
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },      
      https: (options.https !== undefined) ? options.https : await devCerts.getHttpsServerOptions(),
      port: process.env.npm_package_config_dev_server_port || 3000
    },
    optimization: {
        // We no not want to minimize our code.
        minimize: false,
    },
    node: {
        buffer: true,
        crypto: true,
        os: true,
        path: true,
        stream: true,
  
        // NOTE: To avoid - Module not found: Error: Can't resolve 'fs' in 'C:\Work\EnvisionBlockchain\shuttle-excel\Repo\ShuttleExcel\node_modules\ts-nats\lib'
        fs: "empty",
        // NOTE: To avoid - Module not found: Error: Can't resolve 'net' in 'C:\Work\EnvisionBlockchain\shuttle-excel\Repo\ShuttleExcel\node_modules\ts-nats\lib'
        net: "empty",
        // NOTE: To avoid - Module not found: Error: Can't resolve 'tls' in 'C:\Work\EnvisionBlockchain\shuttle-excel\Repo\ShuttleExcel\node_modules\ts-nats\lib'
        tls: "empty",
    }
  };

  return config;
};