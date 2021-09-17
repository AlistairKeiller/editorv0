basic = `class Main {
  public static void main(String[] args) {
    System.out.println("Hello world!");
  }
}`, ace = '';



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
