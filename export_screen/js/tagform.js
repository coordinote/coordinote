//socket io
const socket = io.connect('http://localhost:6277')
//send to get all tags
socket.emit('req_all_tags')

//recieve all tags
socket.on('return_all_tags', (alltags) => {
  //set complete clip
  let cliptags = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('clip'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: $.map(alltags, (tag) => {
      return {
        clip: tag
      }
    })
  })
  //reflection of clip setting
  cliptags.initialize()
  //input auto complete clip
  $('.bootstrap-tagsinput').tagsinput({
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

let data = ["test", "テスト"]
//input complete tile
let tiletags = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('tile'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: $.map(data, (tag) => {
    return {
      tile: tag
    }
  })
})
//reflection of tile setting
tiletags.initialize()
//input auto complete tile
$('.tile-tags-form input').tagsinput({
  typeaheadjs: [{
    minLength: 1,
    highlight: true
  },{
    minlength: 1,
    name: 'tiletags',
    displayKey: 'tile',
    valueKey: 'tile',
    source: tiletags.ttAdapter()
  }],
  freeInput: true
})
