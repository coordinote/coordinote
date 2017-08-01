// toggle sidebar
$('#sidebar_toggle').click(() => {
  $('article.clip-bar').toggleClass('active')
})

$('#export_button').click(() => {
  ipcRenderer.send(PATH_DATA.event, PATH_DATA.export_path)
})
