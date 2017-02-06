/**
 * Created by moshe on 1/15/17.
 */


//setup feed chat socket.io by; https://gist.github.com/crtr0/2896891
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  socket.on('room', function(room) {
    if(socket.room)
      socket.leave(socket.room);

    socket.join(room);
  });
});
server.listen(3000);


function Chat() {
  this.prototype.chat = chat;
}

Chat.prototype.send_to_group = function send_to_group(room, object) {
  io.sockets.in(room).emit('message', JSON.stringify(object));
};
module.exports = Chat;
