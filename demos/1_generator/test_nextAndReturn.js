function* myGenerator() {
	console.log( 'a' );
	yield 1;
	console.log( 'b' );
	return 100;
	yield 2;
	console.log( 'c' );
	yield 3;
	console.log( 'd' );
}

var g = myGenerator();

console.log( g.next() ); // { value: '1', done: false }
console.log( g.next() ); // { value: '2', done: false }
console.log( g.next() ); // '3'
console.log( g.next() );

// for ( var i of g ) {
// 	console.log( i );
// }