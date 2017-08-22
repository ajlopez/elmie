
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

exports['primitive types equal'] = function (test) {
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

exports['functional type not equal to primitive ones'] = function (test) {
	var func = types.func(types.Int, types.Int);
	
	test.strictEqual(types.equal(func, types.Int), false);
	test.strictEqual(types.equal(func, types.Float), false);
	test.strictEqual(types.equal(func, types.Number), false);
	test.strictEqual(types.equal(func, types.String), false);
}

exports['list type'] = function (test) {
	var list = types.list(types.String);
	
	test.ok(list);
	test.equal(typeof list, 'object');
	test.strictEqual(list.type(), types.String);
}

exports['list type equal'] = function (test) {
	var list1 = types.list(types.String);
	var list2 = types.list(types.String);
	var list3 = types.list(types.Int);
	
	test.strictEqual(types.equal(list1, list1), true);
	test.strictEqual(types.equal(list1, list2), true);
	test.strictEqual(types.equal(list2, list1), true);
	test.strictEqual(types.equal(list1, list3), false);
	test.strictEqual(types.equal(list2, list3), false);
}

exports['list type is not equal to primitive ones'] = function (test) {
	var list = types.list(types.String);
	
	test.strictEqual(types.equal(list, types.Int), false);
	test.strictEqual(types.equal(list, types.Float), false);
	test.strictEqual(types.equal(list, types.Number), false);
	test.strictEqual(types.equal(list, types.String), false);
}

exports['numeric predicate'] = function (test) {
	test.strictEqual(types.numeric(types.Int), true);
	test.strictEqual(types.numeric(types.Float), true);
	test.strictEqual(types.numeric(types.Number), true);

	test.strictEqual(types.numeric(types.func(types.Int, types.Int)), false);
	test.strictEqual(types.numeric(types.list(types.String)), false);
}

exports['from string'] = function (test) {
	test.strictEqual(types.fromString('Int'), types.Int);
	test.strictEqual(types.fromString('Float'), types.Float);
	test.strictEqual(types.fromString('number'), types.Number);
	test.strictEqual(types.fromString('String'), types.String);
}

exports['primitive types to string'] = function (test) {
	test.strictEqual(types.Int.toString(), 'Int');
	test.strictEqual(types.Float.toString(), 'Float');
	test.strictEqual(types.Number.toString(), 'number');
	test.strictEqual(types.String.toString(), 'String');
}

exports['functional types to string'] = function (test) {
	test.strictEqual(types.func(types.Int, types.String).toString(), 'Int -> String');
	test.strictEqual(types.func(types.Int, types.func(types.String, types.Float)).toString(), 'Int -> String -> Float');
}

exports['match types to numeric'] = function (test) {
	test.strictEqual(types.Int.match(types.Number), true);
	test.strictEqual(types.Float.match(types.Number), true);
	test.strictEqual(types.Number.match(types.Number), true);

	test.strictEqual(types.String.match(types.Number), false);
	test.strictEqual(types.list(types.Int).match(types.Number), false);
	test.strictEqual(types.func(types.Int, types.Int).match(types.Number), false);
}

