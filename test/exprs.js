
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

