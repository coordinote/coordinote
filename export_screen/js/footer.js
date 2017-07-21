let footerdate = date_instance.getFullYear()+'/'+date_instance.getDate()+'/'+date_instance.getMonth()+1
$('#date-val-text').text(currentdate)

$('.clip-form').on('DOMSubtreeModified propertychange', () => {
  $('#clip-val-text').text($('.clip-field').length+" clip")
})
$('.tile-form').on('DOMSubtreeModified propertychange', () => {
  $('#tile-val-text').text($('.tile-field').length+" tile")
})
