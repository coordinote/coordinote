$('.start').datepicker({
  language: 'ja'
})

$('.end').datepicker({
  language: 'ja'
})

$('.designate').click(() => {
  let start_date = Date.parse($('.start').val())
  let end_date = Date.parse($('.end').val())
  if($('.start').val() !== "" && $('.end').val() !== ""){
    console.log(start_date+" ~ "+end_date)
    console.log(new Date(start_date)+" ~ "+new Date(end_date))
  }
})
