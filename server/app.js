const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io').listen(http)

app.get('/',(req,res) => {
  res.sendfile(__dirname +'/index.html')
})

http.listen(3000,() => {
  console.log('Open 3000')
})

app.get('/css/login.css',(req, res) => {
  res.sendfile(__dirname + '/css/login.css')
})

app.get('/img/logo.png', (req, res) => {
  res.sendfile(__dirname + '/img/logo.png')
})

app.get('/css/style.css',(req, res) => {
  res.sendfile(__dirname + '/css/style.css')
})

app.get('/img/bg-img.jpg',(req, res) => {
  res.sendfile(__dirname + '/img/bg-img.jpg')
})

app.get('/svg-canvas.html',(req,res) => {
  res.sendfile(__dirname + '/svg-canvas.html')
})

app.get('/js/draw.js',(req,res) => {
  res.sendfile(__dirname + '/js/draw.js')
})

app.get('/js/resize.js',(req,res) => {
  res.sendfile(__dirname + '/js/resize.js')
})

io.sockets.on('connection',(socket) => {
  //server receive stroke style
  socket.on('pathdata_pathFloat_from_canvas',(Floatdata) => {
    //server send stroke style
    socket.broadcast.emit('pathdata_PathFloat_from_server',Floatdata)
  })
  //server send pointdata
  socket.on('pointdata_from_canvas',(pointdata) => {
    socket.broadcast.emit('pointdata_from_server',pointdata)
  })
  //save tile data
  socket.on('save_tile',(TILE) => {
    //tile data send database
    nedb.set_tile(TILE,(save_doc) => {
      console.log(save_doc)
    })
  })
  socket.on('save_clip',(tag) => {
    nedb.set_clip(tag,(newclip) => {
      socket.emit('return_cid',newclip._id)
    })
  })
  socket.on('req_all_tags',() => {
    nedb.get_clips_tags((alltags) => {
      socket.emit('return_all_tags',alltags)
    })
  })
})
