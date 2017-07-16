//socket io
const socket = io.connect('http://localhost:6277')
//user input all infomation
let inputinfo = []
//send to get all tags
socket.emit('get_allcliptags')

//recieve all clip tags
socket.on('res_allcliptags', (rec) => {
  //set complete clip
  let cliptags = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('clip'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: $.map(rec, (tag) => {
      return {
        clip: tag
      }
    })
  })
  //reflection of clip setting
  cliptags.initialize()
  //input auto complete clip
  $('.clip-tags-form').tagsinput({
    typeaheadjs: [{
      minLength: 1,
      highlight: true,
    },{
      minlength: 1,
      name: 'cliptags',
      displayKey: 'clip',
      valueKey: 'clip',
      source: cliptags.ttAdapter()
    }],
    freeInput: true
  })
})

$('#search-button').click(() => {
  inputinfo.push({
    cliptags: $('.clip-tags-form').tagsinput('items'),
    startdate: Date.parse($('.start').val()),
    enddate: Date.parse($('.end').val())
  }) 
  socket.emit('send_clipsearchdata', inputinfo[0])
  $('.tile-tags-form').tagsinput('refresh')
  inputinfo = []
  console.log(inputinfo[0])
})

//recieve all tile tags
socket.on('res_alltiletags', (rec) => {
  console.log(rec)
})

