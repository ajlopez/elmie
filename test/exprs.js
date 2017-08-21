
var exprs = require('../lib/exprs.js');
var types = require('../lib/types.js');

exports['integer constant expression'] = function (test) {
	var cons = exprs.constant(42, types.Int);
	
	test.ok(cons);
	test.equal(typeof cons, 'object');
	test.strictEqual(cons.evaluate(), 42);
	test.strictEqual(cons.type(), types.Int);
	test.strictEqual(cons.compile(), '42');
}

exports['float constant expression'] = function (test) {
	var cons = exprs.constant(3.14159, types.Float);
	
	test.ok(cons);
	test.equal(typeof cons, 'object');
	test.strictEqual(cons.evaluate(), 3.14159);
	test.strictEqual(cons.type(), types.Float);
	test.strictEqual(cons.compile(), '3.14159');
}

exports['string constant expression'] = function (test) {
	var cons = exprs.constant('foo', types.String);
	
	test.ok(cons);
	test.equal(typeof cons, 'object');
	test.strictEqual(cons.evaluate(), 'foo');
	test.strictEqual(cons.type(), types.String);
	test.strictEqual(cons.compile(), '"foo"');
}

exports['add integer integer expression'] = function (test) {
	var add = exprs.add(exprs.constant(41, types.Int), exprs.constant(1, types.Int));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '41 + 1');
}

exports['add integer float expression'] = function (test) {
	var add = exprs.add(exprs.constant(41, types.Int), exprs.constant(1.5, types.Float));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42.5);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '41 + 1.5');
}

exports['add float integer expression'] = function (test) {
	var add = exprs.add(exprs.constant(41.5, types.Float), exprs.constant(1, types.Int));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42.5);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '41.5 + 1');
}

exports['add expression with left number'] = function (test) {
	var add = exprs.add(exprs.constant(40.5, types.Number), exprs.constant(1.5, types.Float));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '40.5 + 1.5');
}

exports['add expression with right number'] = function (test) {
	var add = exprs.add(exprs.constant(40.5, types.Float), exprs.constant(1.5, types.Number));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '40.5 + 1.5');
}

exports['invalid add expression with left string'] = function (test) {
	try {
		exprs.add(exprs.constant("foo", types.String), exprs.constant(1.5, types.Number));
		test.fail();
	}
	catch (ex) {
		
	}
}

exports['invalid add expression with right string'] = function (test) {
	try {
		exprs.add(exprs.constant(42, types.Int), exprs.constant("foo", types.String));
		test.fail();
	}
	catch (ex) {
		
	}
}

exports['subtract integer integer expression'] = function (test) {
	var subtract = exprs.subtract(exprs.constant(43, types.Int), exprs.constant(1, types.Int));
	
	test.ok(subtract);
	test.equal(typeof subtract, 'object');
	test.strictEqual(subtract.evaluate(), 42);
	test.strictEqual(subtract.type(), types.Number);
	test.strictEqual(subtract.compile(), '43 - 1');
}

exports['subtract integer integer expression using name'] = function (test) {
	var subtract = exprs.subtract(exprs.constant(43, types.Int), exprs.name('one', types.Int));
	
	test.ok(subtract);
	test.equal(typeof subtract, 'object');
	test.strictEqual(subtract.evaluate({ names: { one: 1 } }), 42);
	test.strictEqual(subtract.type(), types.Number);
	test.strictEqual(subtract.compile(), '43 - one');
}

exports['define expression'] = function (test) {
	var def = exprs.define('foo', exprs.constant(42, types.Int));
	
	test.ok(def);
	
	var ctx = {};
	
	var result = def.evaluate(ctx);
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.ok(ctx.names);
	test.ok(ctx.names.foo);
	test.strictEqual(ctx.names.foo, 42);
	
	test.equal(def.compile(), 'var foo = 42');
}

exports['name expression'] = function (test) {
	var name = exprs.name('foo', types.Int);
	
	test.ok(name);
	
	var result = name.evaluate({ names : { foo: 42 } });
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.equal(name.compile(), 'foo');
}

exports['apply expression'] = function (test) {
	var ctx = { names: { add: function (a, b) { return a + b; } } };
	
	var apply = exprs.apply([ exprs.name('add', types.func(types.Int, types.func(types.Int, types.Int))), exprs.constant(41, types.Int), exprs.constant(1, types.Int) ]);
	
	test.ok(apply);
	
	var result = apply.evaluate(ctx);
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.equal(apply.compile(), 'add(41, 1)');
}

exports['dot expression'] = function (test) {
	var dot = exprs.dot(exprs.name('foo'), exprs.name('bar'));
	
	test.ok(dot);
	
	var result = dot.evaluate({ names: { foo: { bar: 42 } } });
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.equal(dot.compile(), 'foo.bar');
}

exports['function expression'] = function (test) {
	var func = exprs.func(['a', 'b'], exprs.add(exprs.name('a', types.Int), exprs.name('b', types.Int)));
	
	test.ok(func);
	
	var result = func.evaluate();
	
	test.ok(result);
	test.equal(typeof result, 'function');
	test.equal(result.length, 2);
	test.equal(result.apply(null, [1, 2]), 3);
	
	test.equal(func.compile(), '(function (a, b) { return a + b; })');
}

