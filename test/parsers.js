
var parsers = require('../lib/parsers');
var types = require('../lib/types');

function expr(text) {
	var parser = parsers.parser(text);
	
	var expr = parser.parseExpression();
	
	if (expr)
		return expr.compile();
	
	return null;
}

exports['parse empty string'] = function (test) {
	test.equal(expr(''), null);
}

exports['parse integer'] = function (test) {
	test.equal(expr('42'), '42');
}

exports['parse integer in parentheses'] = function (test) {
	test.equal(expr('(42)'), '42');
}

exports['parse float'] = function (test) {
	test.equal(expr('3.14159'), '3.14159');
}

exports['parse string'] = function (test) {
	test.equal(expr('"foo"'), '"foo"');
}

exports['parse two integers'] = function (test) {
	var parser = parsers.parser('42\n3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '3');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse apply add'] = function (test) {
	var ctx = {
		names: {
			add: types.func(types.Int, types.func(types.Int, types.Int))
		}
	}
	var parser = parsers.parser('add 1 2', ctx);
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'add(1, 2)');
	
	test.equal(parser.parseExpression(), null);
}

exports['invalid value applying add'] = function (test) {
	var ctx = {
		names: {
			add: types.func(types.Int, types.func(types.Int, types.Int))
		}
	}
	var parser = parsers.parser('add 1 "foo"', ctx);
	
	try {
		parser.parseExpression();
	}
	catch (ex) {
		test.equal(ex.toString(), 'Error: Invalid value');
		return;
	}

	test.fail();
}

exports['parse apply add using indent'] = function (test) {
	var ctx = {
		names: {
			add: types.func(types.Int, types.func(types.Int, types.Int))
		}
	}
	var parser = parsers.parser('add 1\n 2', ctx);
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'add(1, 2)');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse dot expression'] = function (test) {
	var parser = parsers.parser('foo.bar');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'foo.bar');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse add numbers'] = function (test) {
	var parser = parsers.parser('41 + 1');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '41 + 1');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse subtract numbers'] = function (test) {
	var parser = parsers.parser('43 - 1');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '43 - 1');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse define expression'] = function (test) {
	var parser = parsers.parser('answer = 42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'var answer = 42');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse simple type using Int'] = function (test) {
	var ctx = {};
	var parser = parsers.parser('type Id = Int', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.types);
	test.ok(ctx.types.Id);
	test.strictEqual(ctx.types.Id, types.Int);
}

exports['parse simple type using functional type'] = function (test) {
	var ctx = {};
	var parser = parsers.parser('type Decoder = Int -> String', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.types);
	test.ok(ctx.types.Decoder);
	test.ok(types.equal(ctx.types.Decoder, types.func(types.Int, types.String)));
}

exports['parse type annotation'] = function (test) {
	var ctx = {};
	var parser = parsers.parser('answer : Int', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.names);
	test.ok(ctx.names.answer);
	test.ok(types.equal(ctx.names.answer, types.Int));
}

exports['parse type annotation and define'] = function (test) {
	var ctx = {};
	var parser = parsers.parser('answer : Int\nanswer = 42', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.names);
	test.ok(ctx.names.answer);
	test.ok(types.equal(ctx.names.answer, types.Int));
	
	var result = parser.parseExpression();
	
	test.ok(result);
	test.equal(result.compile(), 'var answer = 42');
}

exports['check type annotation'] = function (test) {
	var ctx = {};
	var parser = parsers.parser('answer : Int\nanswer = "foo"', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.names);
	test.ok(ctx.names.answer);
	test.ok(types.equal(ctx.names.answer, types.Int));
	
	try {
		parser.parseExpression();
	}
	catch (ex) {
		test.equal(ex.toString(), 'Error: Invalid value');
		return;
	}

	test.fail();
}

exports['parse anonymous function with one argument'] = function (test) {
	var parser = parsers.parser('\\n -> add n 1');
	
	var result = parser.parseExpression();
	
	test.ok(result);
	test.equal(result.compile(), '(function (n) { return add(n, 1); })');
}

