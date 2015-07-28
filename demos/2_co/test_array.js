var co = require( 'co' );
co(function* () {
	var res = yield [
		Promise.resolve(1),
		Promise.resolve(2),
		Promise.resolve(3),
	];
	console.log(res);
})

co(function* () {
	var res = yield {
		a: Promise.resolve( 'a' ),
		b: Promise.resolve( 'b' )
	};
	console.log(res);
})