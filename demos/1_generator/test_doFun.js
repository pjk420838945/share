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

var g = new myGenerator();

console.log( g.next() );

console.log( g.next() );
