
var types = require('./types');
var exprs = require('./exprs');
var lexers = require('./lexers');
var TokenType = lexers.TokenType;

function Parser(text, ctx) {
	ctx = ctx || {};
	ctx.names = ctx.names || {};
	ctx.types = ctx.types || {};
	
	var lexer = lexers.lexer(text);
	var self = this;
	
	this.parseExpression = function () {
		lexer.skipWhitespaces(true);
		
		if (parseName('type'))
			return parseNamedType();
		
		var expr = parseBinaryExpression();
		
		if (!expr)
			return expr;
				
		for (var token = lexer.nextToken(); token != null && token.type !== TokenType.Symbol && token.type !== TokenType.EndOfExpression; token = lexer.nextToken()) {
			lexer.pushToken(token);
			
			if (token.type === TokenType.Delimiter && token.value === ')')
				break;
			
			newexpr = parseBinaryExpression();
			
			if (Array.isArray(expr))
				expr.push(newexpr)
			else
				expr = [ expr, newexpr ];
		}
		
		if (token && token.type !== TokenType.EndOfExpression && token.type !== TokenType.Delimiter)
			throw new Error("Unexpected '" + token.value + "'");
		
		if (Array.isArray(expr))
			return exprs.apply(expr);
		
		return expr;
	}
	
	function parseName(name) {
		var token = lexer.nextToken();
		
		if (token && token.type === TokenType.Name)
			if (name && token.value === name)
				return true;
			else if (!name)
				return token.value;
		
		if (token)
			lexer.pushToken(token);
		
		return false;
	}
	
	function parseNamedType() {
		var name = parseName();
		
		parseToken(TokenType.Symbol, '=');
		
		var type = parseType();
		
		ctx.types[name] = type;
		
		return false;
	}
	
	function parseType() {
		var typename = parseName();
		
		var type = types.fromString(typename);
		
		if (tryParseToken(TokenType.Symbol, '->'))
			type = types.func(type, parseType());
		
		return type;
	}
	
	function parseBinaryExpression() {
		var expr = parseTerm();
		
		if (!expr)
			return null;
		
		if (tryParseToken(TokenType.Symbol, ':')) {
			var type = parseType();
			ctx.names[expr.compile()] = type;
			return false;
		}
		
		var token = lexer.nextToken();
		
		while (token && token.type === TokenType.Symbol) {
			if (token.value === '.')
				expr = exprs.dot(expr, parseTerm());
			else if (token.value === '+')
				expr = exprs.add(expr, parseTerm());
			else if (token.value === '-')
				expr = exprs.subtract(expr, parseTerm());
			else if (token.value === '=') {
				var name = expr.compile();
				var valueexpr = self.parseExpression();
				
				if (ctx.names[name] && !types.equal(ctx.names[name], valueexpr.type()))
					throw new Error("Invalid value");
				
				expr = exprs.define(name, valueexpr);
			}
			else
				break;
			
			token = lexer.nextToken();
		}
		
		if (token)
			lexer.pushToken(token);
		
		return expr;
	}
	
	function parseTerm() {
		var token = lexer.nextToken();
		
		if (!token)
			return null;

		if (token.type === TokenType.Delimiter && token.value === '(') {
			var expr = self.parseExpression();
			parseToken(TokenType.Delimiter, ')');
			return expr;
		}
		
		if (token.type === TokenType.Integer)
			return exprs.constant(parseInt(token.value), types.Int);
		else if (token.type === TokenType.Float)
			return exprs.constant(parseFloat(token.value), types.Float);
		else if (token.type === TokenType.String)
			return exprs.constant(token.value, types.String);
		else if (token.type === TokenType.Name)
			return exprs.name(token.value, ctx.names[token.value]);
		
		lexer.pushToken(token);
		
		return null;
	}
	
	function parseToken(type, value) {
		var token = lexer.nextToken();
		
		if (token && token.type === type && token.value === value)
			return;
		
		if (token)
			lexer.pushToken(token);
		
		throw new Error("Expected '" + value + "'");
	}

	function tryParseToken(type, value) {
		var token = lexer.nextToken();
		
		if (token && token.type === type && token.value === value)
			return true;
		
		if (token)
			lexer.pushToken(token);
		
		return false;
	}
}

function createParser(text, ctx) {
	return new Parser(text, ctx);
}

module.exports = {
	parser: createParser
};

