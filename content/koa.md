
## ES6 Generator & koa
### 演讲者：彭俊凯

---

@fragment

## koa ?

* 基于Nodejs平台的下一代WEB开发框架 
* koa 是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。
* 基于 ES6 Generator

----------

## 运行环境

* NodeJS
	* 0.11.x版本以上
	* 加入 harmony 启动参数
* io.js

---

### 安装Koa
```javascript
$ npm install koa

```

----------

## 先来一个hello world

```javascript
var koa = require('koa');

var app = koa();

app.use( function* (){
	this.body = 'Hello koa';
} );

app.listen(3000);
```

----------

### Nodejs环境运行koa

```javascript
$ node --harmony helloWorld.js
```

<a href="http://127.0.0.1:3000" target="_blank">http://127.0.0.1:3000</a>

----------

## Why koa ?

@fragment

* 小而美
* 无回调嵌套的异步方法处理
* 友好的错误处理

----------

## 优点一：异步方法处理

----------

### 后台用户登录跳转至审核页面

@fragment

* 用户登陆校验( funA ) -> 获取用户权限( funB ) -> 获取审核信息( funC ) 

----------

### 使用promise时，callback金字塔是这样的：

```javascript
funA( loginInfo ).then( function( userInfo ) {
	return funB( userInfo ).then( function( permission ) {
		return funC( permission ).then( function( list ) {
			assign( 'list', list );
			... ...
		} );
	} );
} );
```

----------

### promise优化之后的代码是这样的：

```javascript
function checkPermission( userInfo ) {
	return funB( userInfo );
}

function getAuditList( permission ) {
	return funC( permission )
}

funA( loginInfo )
	.then( checkPermission )
	.then( getAuditList )
	.then( function( list ) {
		assign( 'list', list );
		...
	} )

```

----------

### 在koa中，异步方法的书写是这样的：

```javascript
app.use( function* ( next ) {
	... ...

	var userInfo = yield funA( loginInfo );
	var permission = yield funB( userInfo );
	var list = yield funC( permission );
	assign( 'list', list );
	... ...
} );
```

----------

### 同步方法的书写方式，来达到异步方法的效果。有效的避免了callback hell

@fragment

* `function* ()`
* `yield`

----------

## ES6 Generator

@fragment

* 使用 `function* ()` 申明生成器函数 -- Generator Function
* 调用生成器函数，获取迭代器对象 -- Generator
* 调用Generator的 `next()` 方法，执行Generator Function内部流程

----------

## Generator例子：

```javascript
function* myGenerator() {
	console.log( 'My Generator' );
}

console.log( myGenerator.constructor.name ); // 'GeneratorFunction'

var g = myGenerator();

g.next();// 'My Generator'
```

----------

## ES6 迭代器协议

* 迭代器对象：
	* 拥有next方法
	* 调用next方法后会返回 { value: Object, done: Boolean }

----------

## 关键字 yield

* `yield`： 可以分割生成器函数的内容，使用Generator的`next()`方法或者使用`for...of`进行遍历

----------

### yield例子:

```javascript
function* myGenerator() {
	yield 1;
	yield 2;
	yield 3;
}

var g = myGenerator();

console.log( g.next() ); // { value: '1', done: false }
console.log( g.next().value ); // '2'
console.log( g.next() ); // { value: '3', done: false }
console.log( g.next() ); // { value: undefined, done: true }

for ( var i of g ) {
	console.log( i );
}
```

----------

### yield的返回值 与 next()的参数

```javascript
function* myGenerator() {
	console.log( 'console - 0' );

	yield

	console.log( 'console - 1' );
	
	console.log( yield 'return text' );
}

var g = myGenerator();

g.next();// 'console - 0'

console.log( g.next() ); // { value: 'return text', done: false }

g.next( 'input text' ); // 'input text'
```

----------

## 补充1: 在GeneratorFunction中使用`return`

* return: 将会结束遍历

----------

## 补充2: 生成器托管函数: yield*

```javascript
function* GeneratorB() {
	yield '伐';
	yield '木';
}

function* GeneratorA() {
	yield 'We';
	yield 'are';

	yield* GeneratorB();

	yield '累！';
}

var arr = [];
for( var i of GeneratorA() ) {
	arr.push( i );
}
console.log( arr.join( ' ' ) );
```

----------

# Questions?

----------

## 使用yield处理函数和promise
```javascript
function funA() {
	return 'content in funA';
}

function funB() {
	return Promise.resolve( 2 );
}

function* myGenerator() {
	
	yield funA();
	
	yield funB();

}

var g = myGenerator();

console.log( g.next() );

console.log( g.next() );

```

----------

## 使用Generator来执行异步方法？

* 如何维护迭代器？
* 何时执行next()？
* 又如何返回异步执行结果？

----------

## co：Generator的苹果壳

* 自动执行生成器函数 获取迭代器
* 通过回调函数，等待异步函数执行完成后调用next()
* 通过next函数的参数，将异步结果返回

----------

## 使用co处理promise的例子 
```javascript
function getPromise(val, err) {
	return new Promise(function (resolve, reject) {
		if (err) reject(err);
		else resolve(val);
	});
}

var co = require( 'co' );
co(function* (){
	var a = yield getPromise(1);
	var b = yield getPromise(2);

	console.log(a);
	console.log(b);
});
```
----------

## co 的实现

```javascript
// 读取文件方法( thunkable )
function readFile(filename) {
    return function(callback) {
        require('fs').readFile(filename, 'utf8', callback);
    };
}

// co调用
co(function*  () {
    var file1 = yield readFile('./file/a.txt');
    var file2 = yield readFile('./file/b.txt');

    console.log(file1);
    console.log(file2);
    return 'done';
})(function(err, result) {
    console.log(result)
});
```

----------
## co的简单实现：
```javascript
function co(generatorFun) {
	return function(fn) {
	    var gen = generatorFun();
	    function next(err, result) {
	        if(err){
	            return fn(err);
	        }
	        var step = gen.next(result);
	        if (!step.done) {
	            step.value(next);
	        } else {
	            fn(null, step.value);
	        }
	    }
	    next();
	}
}
```

----------

## co V4 

* yieldables:
	* promises
	* thunks (functions)
	* array (parallel execution)
	* objects (parallel execution)
	* generators (delegation)
	* generator functions (delegation)

----------

## `yield` Array in co
```javascript
co(function* () {
	var res = yield [
		Promise.resolve(1),
		Promise.resolve(2),
		Promise.resolve(3),
	];
	console.log(res); // => [1, 2, 3]
}).catch(onerror);
```

----------

## var fn = co.wrap(fn*)
```javascript
var fn = co.wrap(function* (val) {
	return yield Promise.resolve(val);
});

fn(true).then(function (val) {
	...
});
```

----------

## Questions?

----------

## 优点二：灵活小巧

* koa一共只有4个文件：application.js、context.js、request.js、response.js
* 实现最基本功能，复杂功能交由middleWare来进行实现和覆盖（同express）

----------

## koa middleware ?

* koa middleware：包含 `next` 和 `yield next`语句 的GeneratorFunction
* koa中使用`app.use`来引入middleware

----------
* 引入封装好的middleware：
```javascript
var logger = require('koa-logger'); //引入middleware
app.use( logger() );
```

* 书写自己的middleware处理逻辑，必须带有`yield next`：
```javascript
app.use( function* ( next ) {
	//... ...
	yield next;
	//... ...
} );
```
----------

## 让我们来看看koa的源代码里app.use做了什么：

```javascript
// in application.js
function Application() {
	...
	this.middleware = []; //创建middleware的array
	...
}

var app = Application.prototype;

app.use = function(fn){
	...
	this.middleware.push(fn); //调用use时，向array中push middleware
	return this;
};

app.callback = function(){
	...
	var fn = co.wrap(compose(mw)); // 所有middleware都包裹在co中进行执行
	...
}

```

----------

## koa Cascading
## 使用koa-compose来执行和串联middlewares

----------

### koa-compose的实现

```javascript
function compose(middleware){
	return function* (next){
		if (!next) next = noop();

		var i = middleware.length;

		while (i--) { //遍历所有的middleware
			next = middleware[i].call(this, next); //执行middleware并传入下一个middleware
		}

		yield *next;
	}
}

function* noop(){} //保证middleware里面的next必定为一个Generator, 可以被yield
```

----------

### 一个koa-compose的例子

----------

## 优点三：异常捕获

----------
## 使用promise时，需要在每个function后进行catch
```javascript
funA( ... ).then( function() {
	throw new Error( 'send ErrorA' );
	funB( ... ).then( function() {
		throw new Error( 'Send ErrorB' );
	} ).catch( function( err ) {
		...
	} );
} ).catch( function( err ) {
	...
} );
```

----------

## 在koa中，异常捕获将更加容易
```javascript
//Error Handler
app.use( function* ( next ){
	try{
		yield next; //稍后介绍
	} catch( err ) {
		...
	}
} );

//Error Thrower
app.use( function* ( next ) {
	...
	throw new Error( 'Send ErrorA' )
	yield next;
	...
} )

//Error Thrower
app.use( function* ( next ) {
	...
	throw new Error( 'Send ErrorB' )
	yield next;
	...
} )
```
----------

## koa middlewares

----------

## koa-route（访问路径解析）

```javascript
var koa = require('koa');
var route = require('koa-route');

var app = koa();

app.use( route.get( 'test/', function* () {
	this.body = 'Testing Page';
} ) );

app.listen( 3000 );
```

----------

## co-view（模板解析）

```javascript
var koa = require('koa');
var view = require('co-view');

var app = koa();

var render = views( __dirname + '/views', { ext: 'jade' } );

app.use( function* () {
	this.body = yield render( 'home', { message: 'Koa is great !' } );
} );

app.listen( 3000 );
```

----------

## koa-session
```javascript
var koa = require('koa');
var session = require('koa-session');

var app = koa();

app.keys = [ 'balabalabala' ];

app.use( session() );
```

----------

## session usage
```javascript
app.use( function* () {
	//将Session中count属性的数字累加
	var n = this.seesion.count || 0;
	n++;
	this.session.count = n;

	//将Session中count属性内容回传给客户端
	this.body = this.session.count;
} );
```

----------

# And More..
<a href="https://github.com/koajs/koa/wiki" target="_blank">GitHub Koa Wiki</a>

----------

## 一个Koa的简单blog演示

----------

## Questions ?

----------

## Thanks

