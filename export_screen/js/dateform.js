let date_instance = new Date()
let currentdate = date_instance.getMonth()+1+'/'+date_instance.getDay()+'/'+date_instance.getFullYear()

$('.start').val(currentdate)
$('.end').val(currentdate)

$(() => {
  $('.start').datepicker({
    language: 'ja',
    autoclose: true
  })
  $('.end').datepicker({
    language: 'ja',
    autoclose: true
  })
})

$(() => {
  $('.start').on('changeDate', (e) => {
    selected_date = e['date']
    $('.end').datepicker('show')
    $('.end').datepicker('setStartDate', selected_date.getMonth()+1+'/'+selected_date.getDate()+'/'+selected_date.getFullYear())
  })
})
