const http = require('http');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello flyRainbow\n')
});
server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}/`)
});
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({httpServer: server});
wsServer.on('request', function (request) {
    var connection = request.accept('echo-protocol', request.origin);
    console.log('client connected');
    var Obj = {
        a: '11166',
        b: 2222222
    };
    var count = 0;
    var timer = null;
    connection.on('message', function (message) {
        // var request = JSON.parse(message);//根据请求过来的数据来更新。
        console.log("收到消息", message);
            timer = setInterval(function () {
                Obj.b++;
                count++
                Obj.count = count;
                if(count < 50) {
                    connection.send(JSON.stringify(Obj));//需要将对象转成字符串。WebSocket只支持文本和二进制数据
                    console.log("更新", JSON.stringify(Obj));
                } else{
                    clearInterval(timer);
                }
            }, 1000);
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Peer ' + connection.remoteAddress + ' disconnected at : ', new Date());
    });
});
