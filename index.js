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
  
  const ws = new WebSocket('ws://54.193.138.138?group=' + window.location.pathname.slice(1));
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

`, server = require('http').createServer(function (req, res) {
//   extention = req.url.slice(1);
//   if (extention == "settings") {
    
//   }
//   if (parseInt(extention)) {
//     port = parseInt(extention);
    
//   } else  else {
//   }
  res.end(ace);
})

wss = new (require('ws').Server)({server: server});
workingWith = {}, groups = {};
wss.on('connection', function(ws, request) {
//   group = (new URLSearchParams(request.url.slice(1))).get('group');
//   if (!(group in groups))
//     groups[group] = [];
//   workingWith[ws] = groups[group];
//   for(member in groups[group])
//     workingWith[member].push(ws);
//   groups[group].push(ws);
  test = {1: []};
  test[1].push(ws)
  
  console.log(test);
//   console.log(groups);
//   console.log(workingWith);

  ws.on('message', function(msg) {
    for(member in workingWith[ws])
      member.send(msg.toString());
  });

  ws.on('close', function() {
    for(member in workingWith[ws])
      workingWith[member] = workingWith[member].filter(m => m !== ws);
    delete workingWith[ws];
    groups[group] = groups[group].filter(m => m !== ws);
    if(groups[group].length == 0)
       delete groups[group];
    sockets = sockets.filter(s => s !== socket);
  });
});

server.listen(80);
