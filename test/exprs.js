
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
	test.strictEqual(add.type(), types.Int);
	test.strictEqual(add.compile(), '41 + 1');
}

exports['add integer float expression'] = function (test) {
	var add = exprs.add(exprs.constant(41, types.Int), exprs.constant(1.5, types.Float));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42.5);
	test.strictEqual(add.type(), types.Float);
	test.strictEqual(add.compile(), '41 + 1.5');
}

exports['add float integer expression'] = function (test) {
	var add = exprs.add(exprs.constant(41.5, types.Float), exprs.constant(1, types.Int));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42.5);
	test.strictEqual(add.type(), types.Float);
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

exports['define expression'] = function (test) {
	var def = exprs.define('foo', exprs.constant(42, types.Int));
	
	test.ok(def);
	
	var ctx = {};
	
	var result = def.evaluate(ctx);
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.ok(ctx.names);
	test.ok(ctx.names.foo);
	test.strictEqual(ctx.names.foo.type(), types.Int);
	test.strictEqual(ctx.names.foo.evaluate(), 42);
	
	test.equal(def.compile(), 'var foo = 42;');
}

exports['name expression'] = function (test) {
	var ctx = {};
	
	exprs.define('foo', exprs.constant(42, types.Int)).evaluate(ctx);
	
	var name = exprs.name('foo');
	
	test.ok(name);
	
	var result = name.evaluate(ctx);
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.equal(name.compile(), 'foo');
}

