
var types = require('./types');
var exprs = require('./exprs');
var lexers = require('./lexers');
var TokenType = lexers.TokenType;

function Parser(text, ctx) {
	ctx = ctx || {};
	
	var lexer = lexers.lexer(text);
	
	this.nextExpression = function () {
		var expr = null;
				
		for (var token = lexer.nextToken(); token != null && token.type !== TokenType.EndOfExpression; token = lexer.nextToken()) {
			if (token.type === TokenType.Delimiter && token.value === ')') {
				lexer.pushToken(token);
				break;
			}
			
			var newexpr;
			
			if (token.type === TokenType.Delimiter && token.value === '(') {
				newexpr = this.nextExpression();
				parseToken(TokenType.Delimiter, ')');
			}
			
			if (token.type === TokenType.Integer)
				newexpr = exprs.constant(parseInt(token.value), types.Int);
			else if (token.type === TokenType.Float)
				newexpr = exprs.constant(parseFloat(token.value), types.Float);
			else if (token.type === TokenType.String)
				newexpr = exprs.constant(token.value, types.String);
			else if (token.type === TokenType.Name)
				newexpr = exprs.name(token.value, ctx.names[token.value]);
			
			if (Array.isArray(expr))
				expr.push(newexpr)
			else if (expr)
				expr = [ expr, newexpr ];
			else
				expr = newexpr;
		}
		
		if (Array.isArray(expr))
			return exprs.apply(expr);
		
		return expr;
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

