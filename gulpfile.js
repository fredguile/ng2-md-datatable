const path = require("path");
const exec = require("child_process").exec;
const gulp = require("gulp");
const gulpSequence = require("gulp-sequence").use(gulp);
const gulpJsonTransform = require("gulp-json-transform");
const inlineTemplates = require("gulp-inline-ng2-template");
const sass = require("node-sass");
const webpack = require("webpack");
const { rollup } = require("rollup");

const MODULE_NAME = "ng2-md-datatable";
const DIST_FOLDER = "./dist";

/**
 * Copy sources to tmp folder
 */
const COPY_SOURCES = {
  SRC: "./src/**/*.ts",
  DEST: "./tmp/inlined-src"
};

/**
 * Inline scss+templates into source code
 * @see  https://github.com/ludohenin/gulp-inline-ng2-template
 */
const INLINE_SOURCES = {
  SRC: "./src/components/*.ts",
  DEST: "./tmp/inlined-src/components",
  CONFIG: {
    base: "/src",
    target: "es6",
    useRelativePaths: true,
    styleProcessor: (path, ext, file, cb) => {
      const compiled = sass.renderSync({
        file: path,
        outputStyle: "compressed"
      });
      cb(null, compiled.css);
    }
  }
};

/**
 * ESM sources location
 */
const ESM_SOURCES_SRC = {
  ES5: "./tmp/es5/ng2-md-datatable.es5.js",
  ES2015: "./tmp/es2015/ng2-md-datatable.js"
};

/**
 * Rollup globals (for generating FESM)
 */
const ROLLUP_GLOBALS = {
  // Typescript
  typescript: "ts",
  tslib: "tslib",

  // Angular dependencies
  "@angular/core": "ng.core",
  "@angular/common": "ng.common",
  "@angular/forms": "ng.forms",
  "@angular/http": "ng.http",
  "@angular/platform-browser": "ng.platformBrowser",
  "@angular/platform-browser-dynamic": "ng.platformBrowserDynamic",
  "@angular/material": "ng.material",

  // Rxjs dependencies
  "rxjs/Observable": "Rx",
  "rxjs/Subject": "Rx",
  "rxjs/BehaviorSubject": "Rx",
  "rxjs/scheduler/queue": "Rx",
  "rxjs/add/observable/from": "Rx.Observable",
  "rxjs/add/observable/of": "Rx.Observable",
  "rxjs/add/operator/distinctUntilChanged": "Rx.Observable.prototype",
  "rxjs/add/operator/filter": "Rx.Observable.prototype",
  "rxjs/add/operator/let": "Rx.Observable.prototype",
  "rxjs/add/operator/map": "Rx.Observable.prototype",
  "rxjs/add/operator/mergeMap": "Rx.Observable.prototype",
  "rxjs/add/operator/observeOn": "Rx.Observable.prototype",
  "rxjs/add/operator/pluck": "Rx.Observable.prototype",
  "rxjs/add/operator/scan": "Rx.Observable.prototype",
  "rxjs/add/operator/skip": "Rx.Observable.prototype",
  "rxjs/add/operator/take": "Rx.Observable.prototype",
  "rxjs/add/operator/takeUntil": "Rx.Observable.prototype",
  "rxjs/add/operator/withLatestFrom": "Rx.Observable.prototype"
};

/**
 * Prep additional dist files
 */
const PREP_DIST_FILES = {
  SRC: [
    "./src/_datatable-theme.scss",
    "./tmp/es5/ng2-md-datatable.es5.metadata.json",
    "./tmp/es2015/ng2-md-datatable.metadata.json",
    "./tmp/es2015/**/*.d.ts"
  ]
};

/**
 * Prep package manifest
 */
const PREP_PKG_MANIFEST = {
  SRC: "package.json",
  WHITESPACES: 2
};

gulp.task("inline-sources", () =>
  gulp
    .src(INLINE_SOURCES.SRC)
    .pipe(inlineTemplates(INLINE_SOURCES.CONFIG))
    .pipe(gulp.dest(INLINE_SOURCES.DEST))
);

gulp.task("copy-sources", () =>
  gulp.src(COPY_SOURCES.SRC).pipe(gulp.dest(COPY_SOURCES.DEST))
);

gulp.task("build:esm:es5", [], cb => {
  exec("npx ngc -p tsconfig-build.es5.json", (error, stdout, stderr) => {
    console.log(stdout, stderr);
    return cb(error);
  });
});

gulp.task("build:esm:es2015", [], cb => {
  exec("npx ngc -p tsconfig-build.es2015.json", (error, stdout, stderr) => {
    console.log(stdout, stderr);
    return cb(error);
  });
});

function buildRollupFESM(input, name, file) {
  return rollup({
    input,
    external: Object.keys(ROLLUP_GLOBALS)
  }).then(bundle =>
    bundle.write({
      name,
      format: "es",
      globals: ROLLUP_GLOBALS,
      sourcemap: false,
      file
    })
  );
}

function webpackUmdBuild(cb) {
  return exec(
    "npx webpack --config webpack-umd.config.js",
    (error, stdout, stderr) => {
      console.log(stdout, stderr);
      return cb(error);
    }
  );
}

gulp.task("build:fesm:es5", ["build:esm:es5"], () =>
  buildRollupFESM(
    ESM_SOURCES_SRC.ES5,
    MODULE_NAME,
    path.join(DIST_FOLDER, "ng2-md-datatable.es5.js"),
    "es"
  )
);

gulp.task("build:fesm:es2015", ["build:esm:es2015"], () =>
  buildRollupFESM(
    ESM_SOURCES_SRC.ES2015,
    MODULE_NAME,
    path.join(DIST_FOLDER, "ng2-md-datatable.js"),
    "es"
  )
);

function webpackUmdBuild(cb) {
  return exec(
    "npx webpack --config webpack-umd.config.js",
    (error, stdout, stderr) => {
      console.log(stdout, stderr);
      return cb(error);
    }
  );
}

gulp.task("build:umd", cb => webpackUmdBuild(cb));

gulp.task("prep-dist-files", () =>
  gulp.src(PREP_DIST_FILES.SRC).pipe(gulp.dest(DIST_FOLDER))
);

function rewriteDistPath(p) {
  return (p && p.replace("dist", ".")) || p;
}

gulp.task("prep-pkg-manifest", () =>
  gulp
    .src(PREP_PKG_MANIFEST.SRC)
    .pipe(
      gulpJsonTransform(
        (data, file) =>
          Object.assign({}, data, {
            main: rewriteDistPath(data.main),
            module: rewriteDistPath(data.module),
            es2015: rewriteDistPath(data.es2015),
            typings: rewriteDistPath(data.typings)
          }),
        PREP_PKG_MANIFEST.WHITESPACES
      )
    )
    .pipe(gulp.dest(DIST_FOLDER))
);

gulp.task("prebuild", gulpSequence("copy-sources", "inline-sources"));
gulp.task("postbuild", gulpSequence(["prep-dist-files", "prep-pkg-manifest"]));

gulp.task(
  "build",
  gulpSequence(
    "prebuild",
    ["build:fesm:es5", "build:fesm:es2015"],
    "build:umd",
    "postbuild"
  )
);
