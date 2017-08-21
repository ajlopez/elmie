
var elmie = require('..');

exports['compile integer'] = function (test) {
	var result = elmie.compile('42');
	
	test.ok(result);
	test.equal(result, '42;\n');
}

exports['compile string'] = function (test) {
	var result = elmie.compile('"foo"');
	
	test.ok(result);
	test.equal(result, '"foo";\n');
}

exports['compile dot expression'] = function (test) {
	var result = elmie.compile('foo.bar');
	
	test.ok(result);
	test.equal(result, 'foo.bar;\n');
}

exports['compile define expression'] = function (test) {
	var result = elmie.compile('answer = 42');
	
	test.ok(result);
	test.equal(result, 'var answer = 42;\n');
}

exports['compile native expression'] = function (test) {
	var result = elmie.compile('log = Native.console.log');
	
	test.ok(result);
	test.equal(result, 'var log = console.log;\n');
}

exports['compile native expression'] = function (test) {
	var result = elmie.compile('log = Native.console.log');
	
	test.ok(result);
	test.equal(result, 'var log = console.log;\n');
}

exports['compile text ignoring new lines'] = function (test) {
	var result = elmie.compile('\nlog = Native.console.log\n\n');
	
	test.ok(result);
	test.equal(result, 'var log = console.log;\n');
}

exports['compile add integers'] = function (test) {
	var result = elmie.compile('1 + 41');
	
	test.ok(result);
	test.equal(result, '1 + 41;\n');
}

exports['compile add three integers'] = function (test) {
	var result = elmie.compile('1 + 1 + 42');
	
	test.ok(result);
	test.equal(result, '(1 + 1) + 42;\n');
}

