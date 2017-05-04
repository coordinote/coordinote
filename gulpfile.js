// require
const gulp = require('gulp')
const less = require('gulp-less')

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

// default
gulp.task('default', () => {
  gulp.watch(edit_screen.less + '/*.less', ['less_edit_screen'])
})

