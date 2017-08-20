
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

exports['functional type'] = function (test) {
	var func = types.func(types.Int, types.Int);
	
	test.ok(func);
	test.equal(typeof func, 'object');
	test.strictEqual(func.input(), types.Int);
	test.strictEqual(func.output(), types.Int);
}

exports['equals simple types'] = function (test) {
	test.strictEqual(types.equal(types.Int, types.Int), true);
	test.strictEqual(types.equal(types.Float, types.Float), true);
	test.strictEqual(types.equal(types.String, types.String), true);
	test.strictEqual(types.equal(types.Int, types.Float), false);
	test.strictEqual(types.equal(types.Float, types.Int), false);
	test.strictEqual(types.equal(types.Int, types.Number), false);
	test.strictEqual(types.equal(types.Float, types.Number), false);
	test.strictEqual(types.equal(types.Int, types.String), false);
	test.strictEqual(types.equal(types.Float, types.String), false);
}
