"use strict";

const watchify = require("watchify");
const browserify = require("browserify");
const gulp = require("gulp");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const gutil = require("gulp-util");
const sourcemaps = require("gulp-sourcemaps");
const assign = require("lodash.assign");
const babelify = require("babelify");
const eslint = require("gulp-eslint");
const stylus = require("gulp-stylus");

// add custom browserify options here
const customOpts = {
  entries: ["./js/app.js"],
  debug: true
};
const opts = assign({}, watchify.args, customOpts);
const b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);
b.transform(babelify);

gulp.task("js", bundle); // so you can run `gulp js` to build the file
b.on("update", bundle); // on any dep update, runs the bundler
b.on("log", gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on("error", gutil.log.bind(gutil, "Browserify Error"))
    .pipe(source("bundle.js"))
    // optional, remove if you don"t need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write("./")) // writes .map file
    .pipe(gulp.dest("./dist"));
}

gulp.task("lint", () => {
  return gulp.src("js/**/*.js")
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task("stylus", () => {
  return gulp.src("stylus/app.styl")
      .pipe(stylus())
      .pipe(gulp.dest("dist"));
});

gulp.task("default", ["js", "stylus"]);

gulp.task("watch", ["lint", "js", "stylus"], function() {
  gulp.watch("stylus/**/*.styl", ["stylus"]);
  gulp.watch("js/**/*.js", ["lint"]);
});
