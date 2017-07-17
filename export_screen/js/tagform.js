const socket = io.connect('http://localhost:6277')
//user input all infomation
let inclipinfo = []
let intileinfo = []

let incliptags
let intiletags

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
  incliptags = $('.clip-tags-form').tagsinput('items')
  intiletags = $('.btn').text().replace(/\s+/g, "").split(',')
  if(incliptags.length == 0){
    incliptags = undefined
  }
  if(intiletags.length == 0){
    intiletags = undefined
  }
  console.log(intiletags)
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
  $('.dropdown-menu').empty()
  socket.emit('send_clipsearchdata', inclipinfo[0])
  socket.emit('send_tilesearchdata', intileinfo[0])
  inclipinfo = []
  intileinfo = []
})

socket.on('res_alltiletags', (rec) => {
  for(i = 0; i < rec.length; i++){
    $('.dropdown-menu').append('<li><input id="'+i+'" type="checkbox" ><label for="'+i+'">'+rec[i]+'</label></li>')
  }
})

socket.on('res_clips', (rec) => {
  for(i = 0; i < rec.length; i++){
    $('.clip-form').append('<div class="clip-field '+i+'" ></div>')
    for(j = 0; j < rec[i].tile.length; j++){
      $('.'+i).append('<div class="col-sm-'+rec[i].tile[j].col+' tile">'+rec[i].tile[j].con+'</div>')
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, "clip-field"])
    }
  }
})


socket.on('res_tiles', (rec) => {
  for(i = 0; i < rec.length; i++){
    if(rec[i].tag.join(',') == $('.btn').text().replace(/\s+/g, "")){
      $('.tile-form').append('<div class="tile-field">'+rec[i].con+'</div>')
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, "tile-field"])
    }
  }
})

