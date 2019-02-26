/*
    macro-task(宏任务)：包括整体代码script，setTimeout，setInterval
    micro-task(微任务)：Promise，process.nextTick
    (1)js的异步我们从最开头就说javascript是一门单线程语言，不管是什么新框架新语法糖实现的所谓异步，其实都是用同步的方法去模拟的，牢牢把握住单线程这点非常重要。
    (2)事件循环Event Loop事件循环是js实现异步的一种方法，也是js的执行机制。
	(3)javascript的执行和运行执行和运行有很大的区别，javascript在不同的环境下，比如node，浏览器，Ringo等等，执行方式是不同的。而运行大多指javascript解析引擎，是统一的。
	(4)process.nextTick(),在当前"执行栈"的尾部----下一次Event Loop（主线程读取"任务队列"）之前----触发回调函数
    (5)setImmediate 在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行。
    (6)javascript是一门单线程语言，Event Loop是javascript的执行机制
    
    node 上面是跑完微任务 就把所有宏任务跑了 再次跑所有微任务
    但是在chrome 宏任务一次只跑一个，按照块执行
    异步-同步，微任务-宏任务 node环境 一次循环中 执行顺序 同步 > process.nextTick() > new Promise.then > setTimeout
*/

	new Promise(function(resolve) { 
		console.log('2'); 
		resolve(); 
	}).then(function() { 
		console.log('4') 
	}) 
	console.log('1'); 
 
	setTimeout(function() { 
		console.log('5'); 
		process.nextTick(function() { 
			console.log('9'); 
		}) 
		new Promise(function(resolve) { 
			console.log('6'); 
			resolve(); 
		}).then(function() { 
			console.log('10') 
		}) 
	})  
	new Promise(function(resolve) { 
		console.log('13'); 
		resolve(); 
	}).then(function() { 
		console.log('14') 
	}) 

	process.nextTick(function() { 
		console.log('3'); 
		process.nextTick(function() {
			console.log('17');
		})
	})

	setImmediate(function A() {
		console.log('15');
		setImmediate(function B(){console.log('16')})
	})

	setTimeout(function() { 
		console.log('7'); 
		new Promise(function(resolve) { 
			console.log('8'); 
			resolve(); 
		}).then(function() { 
			console.log('12') 
		})
		process.nextTick(function() { 
			console.log('11'); 
		}) 
    }) 