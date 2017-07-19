//svg path data size
let pathsize

//socket.io
const socket = io.connect()

//before and after stack
let history_array = []

//recieve data
socket.on('res_pathdata', (req) => {
  let recpath = createPath(req.point, req.tolerance, true)
  Object.assign(recpath.style, req.style)
  $('#canvas').append(recpath)
  $('#datasize').empty()
  $('#datasize').append(req.size + "Byte")
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
      svgdataSize()
    }
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
  //delete path in stack array
  history_array.pop()
  svgdataSize()
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
  socket.emit('send_readconnect')
}
