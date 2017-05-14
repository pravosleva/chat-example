let app = require('express')(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  port = process.env.PORT || 3000,
  clients = [];

app.get('/', function(req, res){ res.sendFile(__dirname + '/index.html'); });

io.on('connection', function(socket){
  clients.push({ socketId: socket.id });//console.log("Users: " + clients.length);

  io.emit('CLIENT_CONNECTED_OR_DISCONNECTED', { msg: (socket.id + " connected!"), name: "service bot", total: clients.length });

  socket.on('CHAT_MESSAGE', function(obj){//console.log("New message from " + obj.name + "...");
    io.emit('CHAT_MESSAGE', obj);
  });

  socket.on('disconnect', function(){
    clients = clients.filter(function(client, i){ return (socket.id !== client.socketId) }, this);
    //console.log("Users after disconnect: " + clients.length);
    //io.emit('CHAT_MESSAGE', { msg: (socket.id + " disconnected..."), name: "service bot" } );
    io.emit('CLIENT_CONNECTED_OR_DISCONNECTED', { msg: (socket.id + " disconnected..."), name: "service bot", total: clients.length });
  });
});

http.listen(port, function(){ console.log('listening on *:' + port); });
