$('#date-val-text').text(currentdate)

$('.clip-form').on('DOMSubtreeModified propertychange', () => {
  $('#clip-val-text').text($('.clip-field').length+" clip")
})

$('.move').click(() => {
  ipcRenderer.send(PATH_DATA.event, PATH_DATA.edit_path)
})
