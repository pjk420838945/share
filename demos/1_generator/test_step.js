function* myGenerator() {
    console.log( 'My Generator' );
}

console.log( myGenerator.constructor.name ); // 'GeneratorFunction'

var g = myGenerator();

console.log( 'do this' );

console.log( g.next() );// 'My Generator'
