/*
    macro-task(宏任务)：包括整体代码script，setTimeout，setInterval
    micro-task(微任务)：Promise，process.nextTick
    (1)js的异步 我们从最开头就说javascript是一门单线程语言，不管是什么新框架新语法糖实现的所谓异步，其实都是用同步的方法去模拟的，牢牢把握住单线程这点非常重要。
    (2)事件循环Event Loop 事件循环是js实现异步的一种方法，也是js的执行机制。
    (3)javascript的执行和运行 执行和运行有很大的区别，javascript在不同的环境下，比如node，浏览器，Ringo等等，执行方式是不同的。而运行大多指javascript解析引擎，是统一的。
    (4)setImmediate 微任务和宏任务还有很多种类，比如setImmediate等等，执行都是有共同点的，有兴趣的同学可以自行了解。
    (5)javascript是一门单线程语言，Event Loop 是javascript的执行机制
    
    node 上面是跑完微任务 就把所有宏任务跑了 再次跑所有微任务
    但是在chrome 先执行整体代码script，进行宏任务和微任务的分类，然后先执行微任务，然后执行宏任务，宏任务一次只跑一个，按照块执行，
    异步-同步，微任务-宏任务 node环境 一次循环中 执行顺序 同步 > process.nextTick() > Promise.then > setTimeout
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
		new Promise(function(resolve) { 
			console.log('6'); 
			resolve(); 
		}).then(function() { 
			console.log('10') 
		}) 
	})  

	Promise.resolve().then(function () {
		console.log('promise1');
	}).then(function () {
		console.log('promise2');
	});

	new Promise(function(resolve) { 
		console.log('3'); 
		resolve(); 
	}).then(function() { 
		console.log('9') 
	}) 
	
	setTimeout(function() { 
		console.log('7'); 
		new Promise(function(resolve) { 
			console.log('8'); 
			resolve(); 
		}).then(function() { 
			console.log('12') 
		}) 
	}) 
	
	setTimeout(function () {
		console.log('setTimeout');
	}, 0);

