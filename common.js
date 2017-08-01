const PATH_DATA = {
  splash_path: "/splash_screen/splash.html",
  edit_path: "/edit_screen/edit.html",
  main_path: "/main_screen/main.html",
  export_path: "/export_screen/export.html",
  settings_path: "/settings_screen/settings.html",
  event: "screen-move"
}

// モジュールとしてロードされた場合はexportする
if(module !== undefined){
  module.exports = {
    PATH_DATA: PATH_DATA
  }
}
