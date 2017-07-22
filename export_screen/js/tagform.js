//socket io
const socket = io.connect('http://localhost:6277')
//user input all infomation
let inclipinfo = []
let intileinfo = []
//user input item
let incliptags
let intiletags = []
// svg con stack(not loaded)
let svg_con_stack_clip = {}
let svg_con_stack_tile = {}
//recieve tags stack
let stacktile = []
//clip form flag
let cflag = true

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
  $('.clip-form').css('overflow', 'scroll')
  cflag = true
  $('.aleart-text').empty()
  incliptags = $('.clip-tags-form').tagsinput('items')
  //select dropdown item to array
  for(i = 0; i < $('.dropdown-menu li').length; i++){
    if($('#'+i).prop('checked')){
      intiletags.push($('#'+i).val())
    }
  }
  if(incliptags.length == 0){
    $('.clip-form').css('overflow', 'hidden')
    incliptags = undefined
    stacktile = []
    $('.dropdown-menu').empty()
    $('.aleart-text').append('<p>CLIP NOT FOUND</p>')
  }
  if(intiletags.length == 0){
    intiletags = undefined
  }else{
    cflag = false
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
  console.log(rec.join(',') +'||'+ stacktile.join(','))
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
  if(cflag){
    for(i = 0; i < rec.length; i++){
      $('.clip-form').append('<div class="clip-field '+i+'" ></div>')
      for(j = 0; j < rec[i].tile.length; j++){
        switch(rec[i].tile[j].sty){
          case "txt":
            $('.'+i).append('<div class="col-sm-'+rec[i].tile[j].col+' tile">'+rec[i].tile[j].con+'</div>')
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "clip-field"])
            break
          case "svg":
            let $span = $('<span></span>', {
              class: 'col-sm-' + rec[i].tile[j].col + ' iframe-wrap'
            })
            let $iframe = $('<iframe></iframe>', {
              id: rec[i].tile[j]._id,
              src: "http://localhost:6277/html/read_nu/",
              scrolling: "auto"
            })
            $('.'+i).append(
              $span.append($iframe)
            )

            // stack to var
            svg_con_stack_clip[rec[i].tile[j]._id] = rec[i].tile[j].con

            // onload
            // caution: can not use arrow func
            $iframe.on('load', function(){
              // write path
              $(this)[0].contentWindow.loadPath(svg_con_stack_clip[$(this).attr("id")])
              // delete from stack
              delete svg_con_stack_clip[$(this).attr("id")]
            })
            break
          default:
            console.error('sty error')
            break
        }
      }
    }
  }
})

//tile form
socket.on('res_tiles', (rec) => {
  $('.clip-form').append('<div class="clip-field with_tile"></div>')
  for(i = 0; i < rec.length; i++){
    switch(rec[i].sty){
      case "txt":
        $('.with_tile').append('<div class="col-sm-'+rec[i].col+' tile">'+rec[i].con+'</div>')
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "clip-field"])
        break
      case "svg":
        let $span = $('<span></span>', {
          class: 'col-sm-' + rec[i].col + ' iframe-wrap'
        })
        let $iframe = $('<iframe></iframe>', {
          id: rec[i]._id,
          src: "http://localhost:6277/html/read_nu/",
          scrolling: "auto"
        })
        $('.with_tile').append(
          $span.append($iframe)
        )

        // stack to var
        svg_con_stack_tile[rec[i]._id] = rec[i].con

        // onload
        // caution: can not use arrow func
        $iframe.on('load', function(){
          // write path
          $(this)[0].contentWindow.loadPath(svg_con_stack_tile[$(this).attr("id")])
          // delete from stack
          delete svg_con_stack_tile[$(this).attr("id")]
        })
        break
      default:
        console.error('sty error')
        break
    }
  }
})

