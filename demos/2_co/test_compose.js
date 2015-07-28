var co = require( 'co' );
var compose = require( 'koa-compose' );

var arr = [];
var mwList = [];

mwList.push( function* ( next ) {
	arr.push( 1 );
	yield next;
	arr.push( 6 );
} );

mwList.push( function* ( next ) {
	arr.push( 2 );
	yield next;
	arr.push( 5 );
} );

mwList.push( function* ( next ) {
	arr.push( 3 );
	yield next;
	arr.push( 4 );
} );

// console.log( co.wrap( compose( mwList ) ) );

co.wrap( compose( mwList ) )().then( function( ) {
	console.log( arr );
} );

