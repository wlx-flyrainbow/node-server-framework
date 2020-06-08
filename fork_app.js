/* 
    fork开启子进程解决文章起初的计算耗时造成线程阻塞。
    在进行 compute 计算时创建子进程，
    子进程计算完成通过 send 方法将结果发送给主进程，
    主进程通过 message 监听到信息后处理并退出。 
*/
const http = require('http');
const fork = require('child_process').fork;

const server = http.createServer((req, res)=>{
    if (req.url === '/compute') {
        const compute = fork('./fork_compute.js');
        compute.send('开启一个新的子进程');

        // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
        compute.on('message', sum => {
            res.end(`Sum is ${sum}`);
            compute.kill();
        })

        // 子进程监听到一些错误消息退出
        compute.on('close', (code, signal) => {
            console.log(`收到close事件，子进程收到信号${signal}而终止，退出码${code}`);
            compute.kill();
        })
    } else {
        res.end('OK');
    }
})

server.listen(3000,()=>{
    console.log(`server started at http://${127.0.0.1}:${3000}`)
})