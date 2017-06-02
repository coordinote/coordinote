// require
const gulp = require('gulp')
const less = require('gulp-less')
const webserver = require('gulp-webserver')

// paths
const edit_screen = {
  less: './edit_screen/less',
  css_build: './edit_screen/css'
}

// tasks
gulp.task('less_edit_screen', () => {
  gulp.src(edit_screen.less + '/*.less')
      .pipe(less())
      .pipe(gulp.dest(edit_screen.css_build))
})

// angular2 server
gulp.task('webserver', () => {
  gulp.src('./')
      .pipe(webserver({
        host: 'localhost',
        port: 8000,
        livereload: true,
        fallback: './edit_screen/edit.html',
        open: true
      }))
})

// default
gulp.task('default', ['webserver'], () => {
  gulp.watch(edit_screen.less + '/*.less', ['less_edit_screen'])
})

