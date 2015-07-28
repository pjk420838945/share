
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