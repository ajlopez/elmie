
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

exports['simple types equal'] = function (test) {
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

exports['functional types equal'] = function (test) {
	var func1 = types.func(types.Int, types.Int);
	var func2 = types.func(types.Int, types.Int);
	var func3 = types.func(types.String, types.Int);
	var func4 = types.func(types.String, types.func(types.Int, types.Float));
	var func5 = types.func(types.String, types.func(types.Int, types.Float));
	var func6 = types.func(types.String, types.func(types.Int, types.String));
	
	test.strictEqual(types.equal(func1, func2), true);
	test.strictEqual(types.equal(func2, func1), true);
	test.strictEqual(types.equal(func1, func3), false);
	test.strictEqual(types.equal(func3, func1), false);
	
	test.strictEqual(types.equal(func4, func5), true);
	test.strictEqual(types.equal(func5, func4), true);
	test.strictEqual(types.equal(func4, func6), false);
	test.strictEqual(types.equal(func6, func4), false);
}

