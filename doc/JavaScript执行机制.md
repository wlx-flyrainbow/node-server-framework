## JavaScript执行机制

### 单线程

> 浏览器脚本语言：主要是为了操作DOM，与用户互动，单线程避免复杂同步问题。
>
> 多核CPU计算能力强，HTML5提出Web Worker ，允许脚本创建多个线程，但是子线程受主线程控制，不得操作DOM

### 任务队列 task queue

> "任务队列"是一个先进先出的数据结构，排在前面的事件，优先被主线程读取

> ![image-20190225153221347](/var/folders/8q/krr78b1n39981d7_79snf3gw0000gn/T/abnerworks.Typora/image-20190225153221347.png)
>
> 同步任务synchronous：在主线程上排队执行
>
> 异步任务asynchronous：不进入主线程，而进入 “任务队列” ，只有"任务队列"通知主线程，该任务才会进入主线程执行。异步任务必须指定回调函数，当主线程开始执行异步任务，就是执行对应的回调函数。
>
> 定时器：
>
> > setTimeout()接受两个参数，第一个是回调函数，第二个是推迟执行的毫秒数。
> >
> > 回调函数被放入任务队列，一定时间后执行。
> >
> > setTimeout(fn,0)的含义是，指定某个任务在主线程最早可得的空闲时间执行。它在"任务队列"的尾部添加一个事件，因此要等到同步任务和"任务队列"现有的事件都处理完，才会得到执行
> >
> > setTimeout()只是将事件插入了"任务队列"，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码耗时很长，有可能要等很久，所以并没有办法保证，回调函数一定会在setTimeout()指定的时间执行。
>
> 1）所有同步任务都在主线程上执行，形成一个[执行栈](http://www.ruanyifeng.com/blog/2013/11/stack.html)（execution context stack）。
>
> （2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
>
> （3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
>
> （4）主线程不断重复上面的第三步。

### Node.js 

> 运行机制不同于浏览器环境
>
> ![image-20190225154226605](/var/folders/8q/krr78b1n39981d7_79snf3gw0000gn/T/abnerworks.Typora/image-20190225154226605.png)

### 示例

> macro-task(宏任务)：包括整体代码script，setTimeout，setInterval
>
> ​    micro-task(微任务)：Promise，process.nextTick
>
> ​    (1)js的异步我们从最开头就说javascript是一门单线程语言，不管是什么新框架新语法糖实现的所谓异步，其实都是用同步的方法去模拟的，牢牢把握住单线程这点非常重要。
>
> ​    (2)事件循环Event Loop事件循环是js实现异步的一种方法，也是js的执行机制。
>
> ​    (3)javascript的执行和运行执行和运行有很大的区别，javascript在不同的环境下，比如node，浏览器，Ringo等等，执行方式是不同的。而运行大多指javascript解析引擎，是统一的。
>
> ​    (4)process.nextTick(),在当前"执行栈"的尾部----下一次Event Loop（主线程读取"任务队列"）之前----触发回调函数
>
> ​    (5)setImmediate 在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行。
>
> ​    (6)javascript是一门单线程语言，Event Loop是javascript的执行机制
>
> ​    
>
> ​    node 上面是跑完微任务 就把所有宏任务跑了 再次跑所有微任务
>
> ​    但是在chrome 宏任务一次只跑一个，按照块执行
>
> ​    异步-同步，微任务-宏任务 node环境 一次循环中 执行顺序 同步 > process.nextTick() > new Promise.then > setTimeout

```javascript
// chrome 环境
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
```

```javascript
// node 环境
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

```