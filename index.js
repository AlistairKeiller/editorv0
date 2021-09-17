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
  
  const ws = new WebSocket('ws://54.193.138.138/' + window.location.pathname.slice(1));
  events = true;

  ws.onopen = function() {
    editor.session.on('change', function(delta) {
      if (events) {
        switch (delta.action){
          case "remove":
            delta = ws.send(JSON.stringify({action: "remove", start: delta.start, end: delta.end}));
            break;
          case "insert":
            delta = ws.send(JSON.stringify({action: "insert", start: delta.start, lines: delta.lines.join("\\n")}));
            break;
        }
      }
    });
  };

  ws.onmessage = function(msg) {
    msg = JSON.parse(msg.data);
    events = false;
    switch (msg.action){
      case "remove":
        editor.session.remove({start: msg.start, end: msg.end});
        break;
      case "insert":
        editor.session.insert(msg.start, msg.lines);
        break;
      case "get":
        ws.send(JSON.stringify({action: "set", value: editor.getValue()}));
        break;
      case "set":
        editor.setValue(msg.value, -1);
        break;
    }
    events = true;
  };
</script>`, basic = `class Main {
  public static void main(String[] args) {
    System.out.println("Hello world!");
  }
}`
server = require('http').createServer(function (req, res) {
  switch (req.url){
    case "/":
      res.writeHead(302, {location: Math.random().toString().slice(2)});
      res.end();
      break;
    default:
      res.end(ace);
  }
})

groups = {}, waitingForSet = {};
(new (require('ws').Server)({server: server})).on('connection', function(ws, request) {
  group = request.url.slice(1);
  if (group in groups){
    if (group in waitingForSet)
      waitingForSet[group].push(ws);
    else{
      groups[group][0].send(JSON.stringify({action: "get"}));
      waitingForSet[group] = [ws];
    }
  } else {
    ws.send(JSON.stringify({action: "set", value: basic}));
    groups[group] = [ws];
  }

  ws.on('message', function(msg) {
    msg = msg.toString();
    if (JSON.parse(msg).action == "set"){
      waitingForSet[group].forEach(member => {member.send(msg); groups[group].push(member);})
      delete waitingForSet[group];
    } else
      groups[group].forEach(member => {if (member != ws) member.send(msg);});
  });

  ws.on('close', function() {
    groups[group] = groups[group].filter(member => member != ws);
    if(groups[group].length == 0)
       delete groups[group];
  });
});

server.listen(80);
