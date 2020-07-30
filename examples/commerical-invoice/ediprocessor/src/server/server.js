import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { SetupServiceRoutes } from "./Services";
import {
  FunctionResult,
  FunctionResultStatus,
} from "common-core/FunctionResult";
import _ from "lodash";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3001;

// setup body parsing
app.use(bodyParser.json({ limit: "15mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));

const contentFolder = path.join(__dirname, "../content");
console.log(contentFolder);
app.use("/content", express.static(contentFolder));

// install all service routes
SetupServiceRoutes(app);

if (process.env.NODE_ENV === "development") {
  const webpack = require("webpack");
  const webpackMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const config = require("../../configs/webpack.dev.config");
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: "../app",
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.get("*", function response(req, res) {
    res.write(
      middleware.fileSystem.readFileSync(
        path.join(__dirname, "../app/index.html")
      )
    );
    res.end();
  });
} else {
  // root app code
  const rootApp = path.join(__dirname, "../app");
  app.use(express.static(rootApp));
  // catch all
  const catchAllIndex = fs.readFileSync(
    path.join(__dirname, "../app/index.html")
  );
  app.get("*", function response(req, res) {
    res.write(catchAllIndex);
    res.end();
  });
}

// catch security failures and return error info not text
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401);

    // respond with html page
    if (req.accepts("application/json")) {
      // respond with json
      const ret = FunctionResult.new();
      ret.AddMessageAuthentication(
        "Invalid Authentication Token!  Please login again."
      );
      ret.Status = FunctionResultStatus.Failure;
      return res.json(ret);
    } else {
      return res.render("Errors/401.html");
    }
  } else {
    res.status(500);

    if (req.accepts("application/json")) {
      const ret = FunctionResult.new();
      if (_.has(err, "isFR")) {
        ret.Messages.push(err);
      } else {
        ret.AddMessageError(err.message);
      }
      ret.Status = FunctionResultStatus.Failure;
      return res.json(ret);
    } else {
      return res.render("Errors/500.html", {
        errors: [{ Message: err.message || err.Message }],
      });
    }
  }
});

app.listen(port, "0.0.0.0", function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info(`Web Client Server is now running on http://localhost:${port}`);
});
