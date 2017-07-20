// toggle sidebar
$('#sidebar_toggle').click(() => {
  $('article.clip-bar').toggleClass('active')
})

$('#export_button').click(() => {
  ipcRenderer.send(PATH_DATA.event, PATH_DATA.pdf_path)
})

$('#preview').click(() => {
  ipcRenderer.send(PATH_DATA.event, PATH_DATA.main_path)
})
