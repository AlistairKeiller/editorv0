const ace = `<script src="http://ajaxorg.github.io/ace-builds/src-min/ace.js"></script><script src="http://ajaxorg.github.io/ace-builds/src-min/ext-language_tools.js"></script>
<style>#editor {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}</style>

<div id="editor"></div>

<script>require("ace/ext/language_tools");
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/dracula");
  editor.session.setMode("ace/mode/java");
  editor.setOptions({enableLiveAutocompletion: true});

  const ws = new WebSocket('ws://54.193.138.138:8080/Alistair');
  eventsOn = true;

  ws.onopen = function() {
    editor.session.on('change', function(delta) {
      if (eventsOn)
        ws.send(JSON.stringify(delta));
    });
  };

  ws.onmessage = function(msg) {
    msg = JSON.parse(msg.data);
    eventsOn = false;
    if(msg.action == "remove")
      editor.session.remove({start: msg.start, end: msg.end});
    else if(msg.action == "insert")
      editor.session.insert(msg.start, msg.lines.join("\\n"));
    eventsOn = true;
  };
</script>`, settings = `

`;

require('http').createServer(function (req, res) {
//   extention = req.url.slice(1);
//   if (extention == "settings") {
    
//   }
//   if (parseInt(extention)) {
//     port = parseInt(extention);
    
//   } else  else {
//   }
  res.end(ace);
}).listen(80);

server = new (require('ws').Server)({port: 8080});
sockets = [];
server.on('connection', function(socket) {
  console.log(socket);
//   sockets.push(socket);

//   socket.on('message', function(msg) {
// //     sockets.filter(s => s !== socket).forEach(s => s.send(msg.toString()));
//   });

//   socket.on('close', function() {
//     sockets = sockets.filter(s => s !== socket);
//   });
});
