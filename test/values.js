
var values = require('../lib/values.js');
var types = require('../lib/types.js');

exports['native integers to Int'] = function (test) {
	var value = values.value(42);
	
	test.ok(value);
	test.equal(typeof value, 'object');
	test.equal(value.value, 42);
	test.equal(value.type, types.Int);
};

exports['native real to Float'] = function (test) {
	var value = values.value(3.14159);
	
	test.ok(value);
	test.equal(typeof value, 'object');
	test.equal(value.value, 3.14159);
	test.equal(value.type, types.Float);
};

