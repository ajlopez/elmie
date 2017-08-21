
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

exports['parse define expression'] = function (test) {
	var parser = parsers.parser('answer = 42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'var answer = 42');
	
	test.equal(parser.parseExpression(), null);
}



