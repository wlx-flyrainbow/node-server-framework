/* 
    箭头函数
    作用：更简短的函数和不绑定this
 */

let xiaoxinFruits = ['orange', 'strawberry', 'mango', 'kiwi'];
let xiaoxinFruitObj = {
    'orange': '橙子',
    'strawberry': '草莓',
    'mango': '芒果',
    'kiwi': '猕猴桃'
};
for (const key in xiaoxinFruitObj) {
    if (xiaoxinFruitObj.hasOwnProperty(key)) {
        const element = xiaoxinFruitObj[key];
        // console.log(`小新喜欢的水果：${key}-----${element}`)
        
    }
}
/* 
    Array.map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。 原始数组不变
    Array.forEach() 方法对数组的每个元素执行一次提供的函数, 原始数组被改变
*/

// 普通函数
xiaoxinFruits.forEach(function (element) {
    // console.log(element);
})
// --------------------- 更短的函数 -----------------------------------------
// 箭头函数
/* xiaoxinFruits.forEach( (element) => {
    console.log(`小新喜欢的水果：${xiaoxinFruitObj[element]}=====${element}`);
}) */
// 只有1个参数时可以省略 （）
let fruits = xiaoxinFruits.map( element => {
    return `${element}-${xiaoxinFruitObj[element]}`;
});
// 当箭头函数的函数体只有一个 `return` 语句时，可以省略 `return` 关键字和方法体的花括号
fruits = xiaoxinFruits.map( element => `${element}-${xiaoxinFruitObj[element]}`);
console.log(`小新喜欢的水果： ${fruits}`);
xiaoxinFruits.forEach( element => console.log(`小新喜欢的水果：${xiaoxinFruitObj[element]}=====${element}`));

// --------------------- 不绑定this -----------------------------------------
function Fruits() {
    this.num = 4;
    setTimeout(function(){
       console.log(this.num);
    }, 0);
}

let f1 = new Fruits(); // undefined

// 箭头函数不会创建自己的this,它只会从自己的作用域链的上一层继承this
function FruitsHasArrow() {
    this.num = 4;
    setTimeout(() => {
       console.log(this.num);
    }, 0);
}
let f2 = new FruitsHasArrow(); // 4

// 编译后
function FruitsUseThat() {
    var that = this;
    that.num = 4;
    setTimeout(function() {
       console.log(that.num);
    }, 0);
}
let f3 = new FruitsUseThat(); // 4

// 由于 箭头函数没有自己的this指针，通过 call() 或 apply() 方法调用一个函数时，只能传递参数（不能绑定this），他们的第一个参数会被忽略。
// bind() 也不起作用
// 箭头函数不绑定Arguments 对象。因此，在本示例中，arguments只是引用了封闭作用域内的arguments：


// 箭头函数不能用作构造器，和 new一起用会抛出错误。

var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
