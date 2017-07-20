//svg path data size
let pathsize

// svg path data
let pathdata = []

// document ids
/*
{
  cid: ドキュメントのクリップid,
  tid: ドキュメントのタイルid
}
 */
let doc_id = {}

//socket.io
const socket = io.connect()

//before and after stack
let history_array = []

// svg path data (before and after stack)
let history_array_pathdata = []

//recieve data
socket.on('res_pathdata', (req) => {
  let recpath = createPath(req.point, req.tolerance, true)
  Object.assign(recpath.style, req.style)

  // save to model
  pathdata.push(req)
  $('#canvas').append(recpath)
  $('#datasize').empty()
  $('#datasize').append(req.size + "Byte")

  // send to db
  if(Object.keys(doc_id).length !== 0){
    socket.emit('update_tilecon', {
      con: pathdata,
      cid: doc_id.cid,
      tid: doc_id.tid
    })
  }
})

//recieve before event
socket.on('res_beforeevent', () => {
  //path delete and save
  let save_path = $('path:last').detach()

  //array include savepath and not undefined
  if(history_array.indexOf(save_path.get()[0]) != 0){
    if(save_path.get()[0] !== undefined){
      //add path in stack array
      history_array.push(save_path.get()[0])
      // pop from model
      if(pathdata.length !== 0){
        history_array_pathdata.push(pathdata.pop())
      }
      svgdataSize()
    }
  }

  // send to db
  if(Object.keys(doc_id).length !== 0){
    socket.emit('update_tilecon', {
      con: pathdata,
      cid: doc_id.cid,
      tid: doc_id.tid
    })
  }
})

//recieve after event
socket.on('res_afterevent', (req) => {
  //history_array initialize
  if(req){
    history_array.length = 0
  }
  //path restoration
  $('#canvas').append(history_array[history_array.length - 1])
  // resave to model
  pathdata.push(history_array_pathdata.pop())

  //delete path in stack array
  history_array.pop()
  svgdataSize()

  // send to db
  if(Object.keys(doc_id).length !== 0){
    socket.emit('update_tilecon', {
      con: pathdata,
      cid: doc_id.cid,
      tid: doc_id.tid
    })
  }
})

//create path
function createPath(points, tolerance, highestQuality) {
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  let attribute = SVGCatmullRomSpline.toPath(points.map(point => [point.x, point.y]), tolerance, highestQuality)
  path.setAttributeNS(null, 'd', attribute)
  return path
}

//svg data size of html
function svgdataSize(){
  $('#datasize').empty()
  pathsize = encodeURIComponent($('#canvas').html()).replace(/%../g,"x").length
  $('#datasize').append(pathsize + "Byte")
}

// send readconnect
function sendReadID(){
  if(Object.keys(doc_id).length !== 0){
    socket.emit('send_readconnect', {
      cid: doc_id.cid,
      tid: doc_id.tid
    })
  }
}

// save document ids
function save_cidtid(cid, tid){
  doc_id.cid = cid
  doc_id.tid = tid
}

