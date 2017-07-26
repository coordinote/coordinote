$('#date-val-text').text(currentdate)

$('.clip-form').on('DOMSubtreeModified propertychange', () => {
  $('#clip-val-text').text($('.clip-field').length+" clip")
})

