/* 
    线程是操作系统能够进行运算调度的最小单位
    首先我们要清楚线程是隶属于进程的，被包含于进程之中。
    一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的。

    单线程
    单线程就是一个进程只开一个线程

    Javascript 就是属于单线程，程序顺序执行(这里暂且不提JS异步)，
    可以想象一下队列，前面一个执行完之后，后面才可以执行，
    当你在使用单线程语言编码时切勿有过多耗时的同步操作，否则线程会造成阻塞，导致后续响应无法处理。
    你如果采用 Javascript 进行编码时候，请尽可能的利用Javascript异步操作的特性。
*/

// 计算耗时造成线程阻塞的例子
const http = require('http');
const longComputation = () => {
    let sum = 0;
    for (let index = 0; index < 1e10; index++) {
        sum += index;
    };
    return sum;
};
const server = http.createServer();

server.on('request', (req, res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // res.end instead of res.send. res.send is a part of express module and not of core http module.
    if (req.url === '/compute') {
        console.info('计算开始', new Date());
        const sum = longComputation();
        console.info('计算结束', new Date());
        res.end(`Sum is ${sum}`);
    }else{
        res.end('OK');
    }
    // 计算开始 2019-12-25T03:27:35.902Z
    // 计算结束 2019-12-25T03:27:47.509Z
    // 用户调用/compute之后，会造成线程阻塞，其他路由访问无法响应
    // 通过创建多进程的方式 child_process.fork 和 cluster 来解决解决这个问题。
})
server.listen(3000,()=>{
    process.title='线程阻塞测试';
    
    console.log(`进程id：${process.pid}`)
})


/* 
单线程的一些说明
Node.js 虽然是单线程模型，但是其基于事件驱动、异步非阻塞模式，可以应用于高并发场景，避免了线程创建、线程之间上下文切换所产生的资源开销。

当你的项目中需要有大量计算，CPU 耗时的操作时候，要注意考虑开启多进程来完成了。

Node.js 开发过程中，错误会引起整个应用退出，应用的健壮性值得考验，尤其是错误的异常抛出，以及进程守护是必须要做的。

单线程无法利用多核CPU，但是后来Node.js 提供的API以及一些第三方工具相应都得到了解决，文章后面都会讲到。

*/