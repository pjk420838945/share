function* genFuncWithReturn() {
    yield 'a';
    yield 'b';
    return 'result';
}

var g = genFuncWithReturn();

console.log( g.next() );

console.log( g.next() );

console.log( g.next() );