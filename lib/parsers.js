
var types = require('./types');
var exprs = require('./exprs');
var lexers = require('./lexers');
var TokenType = lexers.TokenType;

function Parser(text, ctx) {
	ctx = ctx || {};
	
	var lexer = lexers.lexer(text);
	var self = this;
	
	this.nextExpression = function () {
		var expr = parseTerm();
		
		if (!expr)
			return null;
				
		for (var token = lexer.nextToken(); token != null && token.type !== TokenType.EndOfExpression; token = lexer.nextToken()) {
			lexer.pushToken(token);
			
			if (token.type === TokenType.Delimiter && token.value === ')')
				break;
			
			newexpr = parseTerm();
			
			if (Array.isArray(expr))
				expr.push(newexpr)
			else
				expr = [ expr, newexpr ];
		}
		
		if (Array.isArray(expr))
			return exprs.apply(expr);
		
		return expr;
	}
	
	function parseTerm() {
		var token = lexer.nextToken();
		
		if (!token)
			return null;

		if (token.type === TokenType.Delimiter && token.value === '(') {
			var expr = self.nextExpression();
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
		
		this.lexer.pushToken(token);
		
		return null;
	}
	
	function parseToken(type, value) {
		var token = lexer.nextToken();
		
		if (!token || token.type === type || token.value === value)
			return;
		
		if (token)
			lexer.pushToken(token);
		
		throw new Error("Expected '" + value + "'");
	}
}

function createParser(text, ctx) {
	return new Parser(text, ctx);
}

module.exports = {
	parser: createParser
};

