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