/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': '/__dirname/node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      'app': 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
      '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
      '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',

      'ng2-bootstrap': 'npm:ng2-bootstrap',
      'ng2-tag-input': 'npm:ng2-tag-input',
      'ng2-material-dropdown': 'npm:ng2-material-dropdown',
      'ng2-date-picker': 'npm:ng2-date-picker',
      'moment': 'npm:moment'

    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'ng2-tag-input': {
        main: 'dist/ng2-tag-input.bundle.js',
        format: 'cjs',
      },
      'ng2-material-dropdown': {
        defaultExtension: 'js',
        main: 'dist/ng2-dropdown.bundle.js',
        format: 'cjs',
      },
      'ng2-tag-input/modules/components/tag-input.template.html': {
        defaultJSExtension: false
      },
      'moment': {
        main: 'moment.js',
        defaultExtension: 'js'
      },
      'ng2-bootstrap': {
        main: 'bundles/ng2-bootstrap.umd.js',
        defaultExtension: 'js'
      },
      'ng2-date-picker': {
        defaultExtension: 'js',
        main: 'index.js',
        format: 'cjs'
      },
      'moment': {
        defaultExtension: 'js',
        main: 'moment.js',
        format: 'cjs'
      }
    }
  });
})(this)
