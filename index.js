var ace, WebSocketServer = require('ws').Server;
require('fs').readFile('ace.html', function (err, data) {
  ace = data;
});

require('http').createServer(function (req, res) {
  res.end(ace);
}).listen(8080);

server = new WebSocketServer({
  port: 8081
});
sockets = [];
server.on('connection', function(socket) {
  sockets.push(socket);

  socket.on('message', function(msg) {
    sockets.forEach(s => s.send(msg.toString()));
  });

  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
  });
});
