
//thunkable
function readFile(filename) {
    return function(callback) {
        require('fs').readFile(filename, 'utf8', callback);
    };
}


co(function* () {
    var file1 = yield readFile('./file/a.txt');
    var file2 = yield readFile('./file/b.txt');

    
    console.log(file2);
    console.log(file1);
    return 'done';
})(function(err, result) {
    console.log(result)
});

function co(generatorFun) {
	return function(fn) {
	    var gen = generatorFun();
	    function doNext(err, result) {
	        if(err){
	            return fn(err);
	        }
	        var step = gen.next(result);
	        if (!step.done) {
	            step.value(doNext);
	        } else {
	            fn(null, step.value);
	        }
	    }
	    doNext();
	}
}





