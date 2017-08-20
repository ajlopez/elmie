
var types = require('../lib/types');

exports['String is a type'] = function (test) {
	test.ok(types.String);
	test.equal(typeof types.String, 'object');
}

exports['Int is a type'] = function (test) {
	test.ok(types.Int);
	test.equal(typeof types.Int, 'object');
}

exports['Float is a type'] = function (test) {
	test.ok(types.Float);
	test.equal(typeof types.Float, 'object');
}

exports['number is a type'] = function (test) {
	test.ok(types.Number);
	test.equal(typeof types.Number, 'object');
}

