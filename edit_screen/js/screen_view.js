// toggle sidebar
$('#clip_toggle').click(() => {
  $('article.clip-bar').toggleClass('active')
})

$('#debug_button').click(() => {
  $('write-view').append($('<textarea>'))
})

