function* myGenerator() {
	console.log( 'console - 0' );

	yield
	
	console.log( 'console - 1' );
	
	console.log( yield 'return text' );
}

var g = new myGenerator();

g.next();// 'console - 0'

console.log( g.next() ); // { value: 'return text', done: false }

g.next( 123 ); // 'input text'