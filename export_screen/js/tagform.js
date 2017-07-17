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
  $('.clip-form').empty()
  $('.tile-form').empty()
  $('.dropdown-menu').empty()
  socket.emit('send_clipsearchdata', inputinfo[0])
  socket.emit('send_tilesearchdata', inputinfo[0])
  inputinfo = []
})

socket.on('res_clips', (rec) => {
  for(i = 0; i < rec.length; i++){
    $('.clip-form').append('<div class="clip-field" id="'+i+'"></div>')
    for(j = 0; j < rec[i].tile.length; j++){
      $('#'+i).append('<div class="col-sm-'+rec[i].tile[j].col+' tile">'+rec[i].tile[j].con+'</div>')
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
    for(j = 0; j < rec[i].tag.length; j++){
      $('.dropdown-menu').append('<li><input id="'+j+'" type="checkbox" ><label for="'+j+'">'+rec[i].tag[j]+'</label></li>')
    }
  }
})

