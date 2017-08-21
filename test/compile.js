
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

