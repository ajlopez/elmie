
var parsers = require('../lib/parsers.js');

function expr(text) {
	var parser = parsers.parser(text);
	
	var expr = parser.nextExpression();
	
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

exports['parse float'] = function (test) {
	test.equal(expr('3.14159'), '3.14159');
}

exports['parse string'] = function (test) {
	test.equal(expr('"foo"'), '"foo"');
}

