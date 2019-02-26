/*
    栈：
        push(element(s)):添加一个(或几个)新元素到栈顶。
     pop():移除栈顶的元素，同时返回被移除的元素。
     peek():返回栈顶的元素，不对栈做任何修改(这个方法不会移除栈顶的元素，仅仅返
        回它)。
     isEmpty():如果栈里没有任何元素就返回true，否则返回false。
     clear():移除栈里的所有元素。
     size():返回栈里的元素个数。这个方法和数组的length属性很类似。
*/
function Stack() {
    let items = [];
    // 各种属性和方法的声明
    this.push = element => {
        return items.push(element);
    };
    this.pop = element => {
        return items.pop(element);
    };
    this.peek = () => {
        return items[items.length - 1];
    };
    this.isEmpty = () => {
        return items.length === 0;
    };
    this.size = () => {
        return items.length;
    };
    this.clear = () => {
        items = [];
    };
    this.print = () => {
        console.log(items.toString());
    };
}
var stack = new Stack();
console.log(stack.isEmpty());

/*
    队列：
     enqueue(element(s)):向队列尾部添加一个(或多个)新的项。
     dequeue():移除队列的第一(即排在队列最前面的)项，并返回被移除的元素。
     front():返回队列中第一个元素——最先被添加，也将是最先被移除的元素。队列不
    做任何变动(不移除元素，只返回元素信息——与Stack类的peek方法非常类似)。
     isEmpty():如果队列中不包含任何元素，返回true，否则返回false。
     size():返回队列包含的元素个数，与数组的length属性类似。
*/
function Queue() {
    var items = [];
    this.enqueue = (element) => {
        items.push(element);
    };
    this.dequeue = () => {
        return items.shift();
    };
    this.front = () => {
        return items[0];
    };
    this.isEmpty = () => {
        return items.length === 0;
    };
    this.size = () => {
        return items.length;
    };
    this.print = () => {
        console.log(items.toString());
    };

}
var queue = new Queue();
console.log(queue.size());
queue.enqueue('==');
queue.print();
queue.enqueue('=');
queue.enqueue('--');
queue.print();
console.log(queue.front());
console.log(queue.dequeue());
queue.print();