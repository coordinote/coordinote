//socket io
const socket = io.connect('http://localhost:6277')
//user input all infomation
let inclipinfo = []
let intileinfo = []
//user input item
let incliptags
let intiletags = []
//recieve tags stack
let stacktile = []
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

//search button event
$('#search-button').click(() => {
  $('.aleart-text').empty()
  incliptags = $('.clip-tags-form').tagsinput('items')
  //select dropdown item to array
  for(i = 0; i < $('.dropdown-menu li').length; i++){
    if($('#'+i).prop('checked')){
      intiletags.push($('#'+i).val())
    }
  }
  if(incliptags.length == 0){
    incliptags = undefined
    $('.aleart-text').append('<p>CLIP NOT FOUND</p>')
  }
  if(intiletags.length == 0){
    intiletags = undefined
  }
  inclipinfo.push({
    cliptags: incliptags,
    startdate: Date.parse($('.start').val()),
    enddate: Date.parse($('.end').val())
  }) 
  intileinfo.push({
    tiletags: intiletags,
    cliptags: incliptags,
    startdate: Date.parse($('.start').val()),
    enddate: Date.parse($('.end').val())
  })

  $('.clip-form').empty()
  $('.tile-form').empty()
  //send input data
  socket.emit('send_clipsearchdata', inclipinfo[0])
  if(intiletags !== undefined){
    socket.emit('send_tilesearchdata', intileinfo[0])
  }
  inclipinfo = []
  intileinfo = []
  intiletags = []
})
//tile tags dropdown
socket.on('res_alltiletags', (rec) => {
  if(rec.join(',') != stacktile.join(',')){
    $('.dropdown-menu').empty()
    for(i = 0; i < rec.length; i++){
      $('.dropdown-menu').append('<li><input id="'+i+'" type="checkbox" value="'+rec[i]+'"><label for="'+i+'">'+rec[i]+'</label></li>')
    }
  }
  stacktile = rec
})

//clip form
socket.on('res_clips', (rec) => {
  for(i = 0; i < rec.length; i++){
    $('.clip-form').append('<div class="clip-field '+i+'" ></div>')
    for(j = 0; j < rec[i].tile.length; j++){
      $('.'+i).append('<div class="col-sm-'+rec[i].tile[j].col+' tile">'+rec[i].tile[j].con+'</div>')
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, "clip-field"])
    }
  }
})

//tile form
socket.on('res_tiles', (rec) => {
  for(i = 0; i < rec.length; i++){
      $('.tile-form').append('<div class="tile-field">'+rec[i].con+'</div>')
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, "tile-field"])
  }
})

