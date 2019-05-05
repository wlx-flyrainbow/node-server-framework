/* this 指向 
    JavaScript 函数中的 this 指向并不是在函数定义的时候确定的，
    而是在调用的时候确定的。由运行环境决定
    函数的调用方式决定了 this 指向。
 */
// 1. script this 直接调用 指向 Window {}
var a = 1
console.log('script', this.a);

// 2. function 中 this 指向 window {}
(function f() {
    var a = 2, b = 1;
    console.log('function 中 b', this.b); // undefined
    console.log('function 中 a', this.a); // 1
})();

// 3. 构造函数中 this ，用 new 调用 ,指向创建的新实例对象

function thisInFn(params) {
    this.a = 3;
    this.x = 3;
    console.log('构造函数 中 this', this); 
}
let fnFunction = new thisInFn(); // thisInFn {a: 3}

// 4. 构造函数的方法中 this ，用 new 调用 ,指向调用它的对象

function thisInFnMethods(params) {
    this.a = params;
    this.fnMethods = function () {
        console.log('构造函数的方法中 this', this);   
    }
}
let fnFunction1 = new thisInFnMethods(4); 
fnFunction1.fnMethods(); // thisInFnMethods {a: 4, fnMethods: ƒ}

/* 改变this 指向 */

// 1.用new调用函数，改变指向 new 的实例对象

function fn(params) {
    console.log('实例化，改变this 指向', this);
}
let f = new fn(); // fn {}

/*  
    2. bind()  
    function.bind(thisArg[, arg1[, arg2[, ...]]])
    方法创建一个新的函数，在调用时设置this关键字为提供的值。 并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。
    返回一个原函数的拷贝，并拥有指定的this值和初始参数。
 */
this.x = 9;    // 在浏览器中，this指向全局的 "window" 对象
var moduleX = {
    x: 81,
    /* getX: function() { 
        console.log(this.x); 
    } */
    getX () { 
        return () =>{
            console.log('arrow getx', this.x); 
        }
    }
};

moduleX.getX(); // 81

var retrieveX = moduleX.getX();
console.log('retrieveX', retrieveX); // 输出的是一个方法
retrieveX();
// 返回9 - 因为函数是在全局作用域中调用的

// 创建一个新函数，把 'this' 绑定到 module 对象
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
var boundGetX = retrieveX.bind(fnFunction);
console.log('boundGetX',boundGetX); // 输出的是一个方法，只是this的指向指向 fnFunction
boundGetX(); // 3 
boundGetX = retrieveX.bind(moduleX);
boundGetX(); // 81 

/* 
    3. call()
    fun.call(thisArg, arg1, arg2, ...)
    call() 方法调用一个函数, 其具有一个指定的this值和分别地提供的参数(参数的列表)
    就是call()方法接受的是若干个参数的列表
    使用调用者提供的this值和参数调用该函数的返回值。若该方法没有返回值，则返回undefined

    使用场景： 
        1.使用call方法调用父构造函数，实现继承
        2.使用call方法调用函数并且指定上下文的'this'
        3.使用call方法调用函数并且没有确定第一个参数（argument）即 指向 Window
*/
// 场景1示例
function Product(name, price) {
    this.name = name;
    this.price = price;
}

function Food(name, price) {
    console.log(this.price); // Food {category: "food",name: "cheese",price: 5}
    Product.call(this, name, price); // 传递参数列表
    console.log(this.price);
    this.category = 'food';
}

console.log(new Food('cheese', 5).name);// expected output: "cheese"

// 场景2 示例
function forever() {
    var reply = [this.a, 'and', this.b, 'forever!!!'].join(' ');
    console.log(reply);
}
var obj = {
    a: 'you',
    b: 'me'
}
forever.call(obj);

// 场景3
// 'use strict';
var name = 'wlx';
function printName(params) {
    console.log(this.name);
}
printName.call();

// 注意： 在严格模式下this的值将会是undefined。

/* 
    4. apply()
    func.apply(thisArg, [argsArray])
    thisArg
    可选的。在 func 函数运行时使用的 this 值。请注意，this可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。
    argsArray
    可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 func 函数。
    apply() 方法调用一个具有给定this值的函数，以及作为一个数组（或类似数组对象）提供的参数。
    使用场景： 
        1.用 apply 将数组添加到另一个数组
*/

// 场景1示例
var array = ['a', 'b'];
var elements = [0, 1, 2];
array.push.apply(array, elements);
console.log(array);

// 场景2示例
function applyFn(name, age) {
    this.name = name;
    this.age = age;
    this.fn1 = function () {
        console.log(this.name)
    }
}
var applyObj = {};
applyFn.apply(applyObj, ['ice', 8]); // 传递数组或类数组
console.log(applyObj); // {name: "ice", age: 8, fn1: ƒ}
applyObj.fn1(); // ice


/*  
    箭头函数中 this  
    箭头函数没有自己的 this 绑定。箭头函数中使用的 this，其实是直接包含它的那个函数 或函数表达式中的 this
    不能用 new 调用
    不能bind() 到某个对象（调用没问题，但是不会产生预期效果）
    不管在什么情况下使用箭头函数，它本身是没有绑定 this 的，它用的是直接外层函数(即包含它的最近的一层函数或函数表达式)绑定的 this
 */
this.x = 10;    // 在浏览器中，this指向全局的 "window" 对象
var arrowX = {
    x: 100,
    test() {
        const arrow = () => {
            // 这里的 this 是 test() 中的 this，
            // 由 test() 的调用方式决定
            console.log('arrow test', this.x);
        };
        arrow();
    },
    getX () { 
        return () =>{
            console.log('arrow getx', this.x); 
        }
    },
    // ES5 Babel转译
    getArrow: function getArrow() {
        var _this = this;
        return function () {
            console.log('arrow getx', _this.x);
        };
    }
};

retrieveX = arrowX.getX();
console.log('retrieveX', retrieveX); // retrieveX 是一个箭头函数
retrieveX(); // 100

boundGetX = retrieveX.bind(fnFunction);
console.log('boundGetX',boundGetX);  // bind() 不起作用
boundGetX(); // 100
boundGetX = retrieveX.bind(moduleX);  // bind() 不起作用
boundGetX(); // 100
