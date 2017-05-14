let app = require('express')(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  port = process.env.PORT || 3000,
  clients = [];

app.get('/', function(req, res){ res.sendFile(__dirname + '/index.html'); });

io.on('connection', function(socket){
  io.emit('chat message', {msg: (socket.id + " connected...")});

  socket.on('chat message', function(obj){
    io.emit('chat message', obj);
  });

  socket.on('disconnect', function(){
    let msg = socket.id + " disconnected...";
    io.emit('chat message', { msg: msg } );
  });
});

http.listen(port, function(){ console.log('listening on *:' + port); });
