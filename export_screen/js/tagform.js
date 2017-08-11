//socket io
const URL = 'http://localhost:6277'
const socket = io.connect(URL)
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
  $('.clip-form').css('overflow-y', 'scroll')
  cflag = true
  $('.aleart-text').css('display', 'none')
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
    $('.aleart-text').css('display', 'inline')
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
  if(rec.join(',') != stacktile.join(',')){
    $('.dropdown-menu').empty()
    for(i = 0; i < rec.length; i++){
      let $li = $('<li></li>')
      let $input = $('<input></input>', {
        id: i,
        type: "checkbox",
        value: rec[i]
      })
      let $label = $('<label></label>', {
        for: i,
        text: rec[i]
      })
      $('.dropdown-menu').append($li.append($input))
      $('.dropdown-menu').append($li.append($label))
    }
  }
  stacktile = rec
})

//clip form
socket.on('res_clips', (rec) => {
  if(cflag){
    for(i = 0; i < rec.length; i++){
      let $div = $('<div></div>', {
        class: 'clip-field ' + i + ' clearfix'
      })
      $('.clip-form').append($div)
      for(j = 0; j < rec[i].tile.length; j++){
        switch(rec[i].tile[j].sty){
          case "txt":
            let $div = $('<div></div>', {
              class: 'col-sm-' + rec[i].tile[j].col + ' col-xs-' + rec[i].tile[j].col + ' tile',
              text: rec[i].tile[j].con
            })
            $('.'+i).append($div)

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "clip-field"])
            break
          case "svg":
            let $span = $('<span></span>', {
              class: 'col-sm-' + rec[i].tile[j].col + ' col-xs-' + rec[i].tile[j].col + ' iframe-wrap'
            })
            let $iframe = $('<iframe></iframe>', {
              id: rec[i].tile[j]._id,
              src: URL + "/html/read_nu/",
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
  let $div = $('<div></div>', {
    class: 'clip-field clearfix with_tile'
  })
  $('.clip-form').append($div)
  for(i = 0; i < rec.length; i++){
    switch(rec[i].sty){
      case "txt":
        let $div = $('<div></div>', {
          class: 'col-sm-' + rec[i].col + ' col-xs-'+ rec[i].col +' tile',
          text: rec[i].con
        })
        $('.with_tile').append($div)

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "clip-field"])
        break
      case "svg":
        let $span = $('<span></span>', {
          class: 'col-sm-' + rec[i].col + ' col-xs-'+ rec[i].col + ' iframe-wrap'
        })
        let $iframe = $('<iframe></iframe>', {
          id: rec[i]._id,
          src: URL + "/html/read_nu/",
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

