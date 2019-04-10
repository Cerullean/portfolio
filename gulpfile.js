(() => {
  "use strict";

  /**************** gulpfile.js configuration ****************/

  const // assigns either development or production (based on environment)
    devBuild =
      (process.env.NODE_ENV || "development").trim().toLowerCase() ===
      "development",
    // directories
    dir = {
      src: "src/",
      dist: "dist/",
      modules: "node_modules/"
    },
    // node modules
    gulp = require("gulp"),
    watch = require("gulp-watch"),
    imagemin = require("gulp-imagemin"),
    minifyjs = require("gulp-uglify"),
    minifycss = require("gulp-clean-css"),
    sass = devBuild ? require("gulp-sass") : null,
    browsersync = devBuild ? require("browser-sync").create() : null;

  console.log("Gulp", devBuild ? "development" : "production", "build");

  // Check gulp
  gulp.task("message", () => console.log("Gulp is running.."));

  /**************** Development Task ****************/

  // Move Bootstrap css files to src/css
  gulp.task("css-src", () =>
    gulp
      .src(`${dir.modules}bootstrap/dist/css/*.css`)
      .pipe(gulp.dest(`${dir.src}/css`))
  );

  // Move Bootstrap JS and Jquery files to out src/scripts
  gulp.task("js-src", () =>
    gulp
      .src([
        `${dir.modules}bootstrap/dist/js/*.js`,
        `${dir.modules}jquery/dist/*.js`
      ])
      .pipe(gulp.dest(`${dir.src}/scripts`))
  );

  // Copy HTML files to dist
  gulp.task("copy-html", () =>
    gulp.src(`${dir.src}*.html`).pipe(gulp.dest(`${dir.dist}`))
  );

  // Minify CSS files and copy to dist
  gulp.task("minify-css", () =>
    gulp
      .src(`${dir.src}css/*`)
      .pipe(
        minifycss({ debug: true }, details => {
          console.log(
            `Old file size ${details.name}: ${details.stats.originalSize}`
          );
          console.log(
            `New file size ${details.name}: ${details.stats.minifiedSize}`
          );
        })
      )
      .pipe(gulp.dest(`${dir.dist}css`))
  );

  // Minify JS files and copy to dist
  gulp.task("minify-js", () =>
    gulp
      .src(`${dir.src}scripts/*.js`)
      .pipe(minifyjs())
      .pipe(gulp.dest(`${dir.dist}scripts`))
  );

  //   Optimize images using imagemin
  //   gulp.task("opt-img", () =>
  //     gulp
  //       .src(`${dir.src}images/*`)
  //       .pipe(imagemin())
  //       .pipe(gulp.dest(`${dir.dist}images`))
  //   );

  // build
  gulp.task(
    "build",
    gulp.parallel("message", "copy-html", "minify-css", "minify-js")
  );

  gulp.task("css-stream", function() {
    // Endless stream mode
    return watch(`${dir.src}css/*.css`, { ignoreInitial: false })
      .pipe(minifycss())
      .pipe(gulp.dest(`${dir.dist}css`));
  });

  gulp.task("task1", function() {
    console.log("Task 1");
  });
  gulp.task(
    "task2",
    gulp.series("task1", function() {
      console.log("Task 2");
    })
  );
  gulp.task(
    "task3",
    gulp.series("task2", function() {
      console.log("Task 3");
    })
  );
})();
