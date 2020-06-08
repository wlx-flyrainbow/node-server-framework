const computation = () => {
    let sum = 0;
    console.info(`计算开始`);
    console.time('计算耗时');
    for (let index = 0; index < 1e10; index++) {
        sum += index;
    };
    console.info(`计算结束`);
    console.timeEnd('计算耗时');
    return sum;
};

process.on('message', msg => {
    console.log(msg, 'process.pid', process.pid) // 子进程id
    const sum = computation();

    // 如果Node.js进程是通过进程间通信产生的，那么，process.send()方法可以用来给父进程发送消息
    process.send(sum);
})
