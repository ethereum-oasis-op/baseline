const path = require("path");
const serverlintPath = path.resolve(__dirname, "./src/server/**/*.js");
const applintPath = path.resolve(__dirname, "./src/core/**/*.js");
const customNodeX12Path = `!${path.resolve(
  __dirname,
  "./src/server/Core/ScriptRunners/node-x12/index.js"
)}`;
const fs = require("fs");
const pkgInfo = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"))
);

module.exports = function (grunt) {
  "use strict";
  //  Project configuration
  grunt.initConfig({
    babel: {
      dist: {
        files: [
          {
            expand: true,
            cwd: "./src/server",
            src: "**/*.js",
            dest: "./dist/server",
            ext: ".js",
          },
        ],
      },
    },
    eslint: {
      options: {
        format: "node_modules/eslint-formatter-pretty",
      },
      target: [serverlintPath, applintPath, customNodeX12Path],
    },
    copy: {
      distcontent: {
        files: [
          {
            expand: true,
            cwd: "./other/images/",
            src: ["**"],
            dest: "dist/content/images/",
          },
        ],
      },
      deployCode: {
        files: [
          {
            expand: true,
            cwd: "./dist/",
            src: ["**"],
            dest: "docker/web/code/",
          },
          { src: "./package.json", dest: "docker/web/code/package.json" },
        ],
      },
    },
    nodemon: {
      dev: {
        script: "dist/server/server.js",
        options: {
          env: {
            PORT: "3001",
            NODE_ENV: "development",
          },
          // omit this property if you aren't serving HTML files and
          // don't want to open a browser tab on start
          callback: function (nodemon) {
            nodemon.on("log", function (event) {
              console.log(event.colour);
            });
          },
          watch: ["dist/server/"],
          delay: 5000,
        },
      },
      test: {
        script: "dist/server/server.js",
        options: {
          env: {
            PORT: "3001",
            NODE_ENV: "production",
          },
          callback: function (nodemon) {
            nodemon.on("log", function (event) {
              console.log(event.colour);
            });
          },
          watch: ["dist/server/"],
          delay: 5000,
        },
      },
    },
    clean: {
      app: ["./dist/app/*"],
      server: ["./dist/server/*"],
      content: ["./dist/content/*"],
      deployCode: ["./docker/web/code/*"],
    },
    exec: {
      buildDocker: {
        cwd: "./docker/web",
        cmd: `docker build --tag=fpw23/${pkgInfo.name}:${pkgInfo.version} .`,
      },
      tagLatestDocker: {
        cwd: "./docker/web",
        cmd: `docker tag fpw23/${pkgInfo.name}:${pkgInfo.version} fpw23/${pkgInfo.name}:latest`,
      },
      createContainerDocker: {
        cmd: `docker create -p 8270:3001 --name ${pkgInfo.name}_${pkgInfo.version} fpw23/${pkgInfo.name}:${pkgInfo.version}`,
      },
      webpackWindows: {
        cwd: "./node_modules/.bin",
        cmd: "webpack --config ../../configs/webpack.prod.config.js",
        options: {
          env: "production",
        },
      },
      webpackLinux: {
        cwd: "./node_modules/.bin",
        cmd: "./webpack --config ../../configs/webpack.prod.config.js",
        options: {
          env: "production",
        },
      },
    },
  });

  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-exec");

  // setup tasks
  grunt.registerTask(
    "start",
    "Start debugging in development mode",
    function () {
      grunt.task.run("clear");
      grunt.task.run("init");
      grunt.task.run("check");
      grunt.task.run("build");
      grunt.task.run("debug");
    }
  );
  grunt.registerTask(
    "run",
    "Start without debugging in production mode",
    function () {
      grunt.task.run("clear");
      grunt.task.run("init");
      grunt.task.run("check");
      grunt.task.run("build");
      grunt.task.run("buildApp");
      grunt.task.run("test");
    }
  );
  grunt.registerTask(
    "deploy",
    "Build docker image for deployment",
    function () {
      grunt.task.run("clear");
      grunt.task.run("clear:deployCode");
      grunt.task.run("init");
      grunt.task.run("check");
      grunt.task.run("build");
      grunt.task.run("buildApp");
      grunt.task.run("copy:deployCode");
      grunt.task.run("exec:buildDocker");
      grunt.task.run("exec:tagLatestDocker");
    }
  );
  grunt.registerTask(
    "buildApp",
    "Run Webpack in production mode based on platform",
    function () {
      if (process.platform === "win32") {
        grunt.task.run("exec:webpackWindows");
      } else {
        grunt.task.run("exec:webpackLinux");
      }
    }
  );
  grunt.registerTask("clear", ["clean:app", "clean:server", "clean:content"]);
  grunt.registerTask("init", ["copy:distcontent"]);
  grunt.registerTask("debug", ["nodemon:dev"]);
  grunt.registerTask("test", ["nodemon:test"]);
  grunt.registerTask("check", ["eslint"]);
  grunt.registerTask("build", ["babel"]);
};
