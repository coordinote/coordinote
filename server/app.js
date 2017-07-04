var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

app.get('/',function(req,res){
  res.sendfile('index.html');
});

http.listen(3000,function(){
  console.log('Open 3000');
});

app.get('/css/login.css', function(req, res){
  res.sendfile(__dirname + '/css/login.css');
});

app.get('/img/logo.png', function(req, res) {
  res.sendfile(__dirname + '/img/logo.png');
});

app.get('/css/style.css', function(req, res) {
  res.sendfile(__dirname + '/css/style.css');
});

app.get('/img/bg-img.jpg', function(req, res) {
  res.sendfile(__dirname + '/img/bg-img.jpg');
});

app.get('/svg-canvas.html',function(req,res){
  res.sendfile(__dirname + '/svg-canvas.html');
});

app.get('/js/draw.js',function(req,res){
  res.sendfile(__dirname + '/js/draw.js');
});

app.get('/js/resize.js',function(req,res){
  res.sendfile(__dirname + '/js/resize.js');
});

io.on('connection',function(socket){
  //server receive stroke style
  socket.on('send_pathdata_pathFloat_from_canvas',function(Floatdata){
    //server send stroke style
    socket.broadcast.emit('send_pathdata_PathFloat_from_server',Floatdata);
  });
  //server send pointdata
  socket.on('send_pointdata_from_canvas',function(pointdata){
    socket.broadcast.emit('send_pointdata_from_server',pointdata)
  });
});
