const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io').listen(http)

http.listen(3000,() => {
  console.log('Open 3000')
})

app.get(/\/html\/*/,(req,res) => {
  res.sendfile(__dirname + req.url)
})

app.get(/\/css\/*/,(req, res) => {
  res.sendfile(__dirname + req.url)
})

app.get(/\/img\/*/, (req, res) => {
  res.sendfile(__dirname + req.url)
})

app.get(/\/js\/*/,(req,res) => {
  res.sendfile(__dirname + req.url)
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
