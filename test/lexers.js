
var lexers = require('../lib/lexers');
var TokenType = lexers.TokenType;

exports['get integer'] = function (test) {
	var lexer = lexers.lexer('42');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	test.equal(lexer.nextToken(), null);
}

exports['get integer with spaces'] = function (test) {
	var lexer = lexers.lexer('  42   ');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	test.equal(lexer.nextToken(), null);
}

exports['get float'] = function (test) {
	var lexer = lexers.lexer('3.14159');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '3.14159');
	test.equal(token.type, TokenType.Float);
	
	test.equal(lexer.nextToken(), null);
}

exports['get float with spaces'] = function (test) {
	var lexer = lexers.lexer('  3.14159   ');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '3.14159');
	test.equal(token.type, TokenType.Float);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name'] = function (test) {
	var lexer = lexers.lexer('foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name with spaces'] = function (test) {
	var lexer = lexers.lexer('   foo    ');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name with digits'] = function (test) {
	var lexer = lexers.lexer('foo42');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo42');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name with underscore'] = function (test) {
	var lexer = lexers.lexer('foo_bar');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo_bar');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name starting with underscore'] = function (test) {
	var lexer = lexers.lexer('_foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '_foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get integer and name'] = function (test) {
	var lexer = lexers.lexer('42 foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get float and name'] = function (test) {
	var lexer = lexers.lexer('3.14159 foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '3.14159');
	test.equal(token.type, TokenType.Float);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get string'] = function (test) {
	var lexer = lexers.lexer('"foo"');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.String);
	
	test.equal(lexer.nextToken(), null);
}

exports['unclosed string'] = function (test) {
	var lexer = lexers.lexer('"foo');
	
	try {
		lexer.nextToken();
		test.fail();
	}
	catch (ex) {
		test.equal(ex.toString(), "Error: Unclosed String");
	}
}

exports['unclosed string with new line'] = function (test) {
	var lexer = lexers.lexer('"foo\n"');
	
	try {
		lexer.nextToken();
		test.fail();
	}
	catch (ex) {
		test.equal(ex.toString(), "Error: Unclosed String");
	}
}

exports['unclosed string with carriage return'] = function (test) {
	var lexer = lexers.lexer('"foo\n"');
	
	try {
		lexer.nextToken();
		test.fail();
	}
	catch (ex) {
		test.equal(ex.toString(), "Error: Unclosed String");
	}
}
