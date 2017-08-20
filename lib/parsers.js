
var types = require('./types');
var exprs = require('./exprs');
var lexers = require('./lexers');
var TokenType = lexers.TokenType;

function Parser(text) {
	var lexer = lexers.lexer(text);
	
	this.nextExpression = function () {
		var expr = null;
				
		for (var token = lexer.nextToken(); token != null && token.type !== TokenType.EndOfExpression; token = lexer.nextToken()) {
			if (token.type === TokenType.Integer)
				expr = exprs.constant(parseInt(token.value), types.Int);
			
			if (token.type === TokenType.Float)
				expr = exprs.constant(parseFloat(token.value), types.Float);

			if (token.type === TokenType.String)
				expr = exprs.constant(token.value, types.String);
		}
		
		return expr;
	}
}

function createParser(text) {
	return new Parser(text);
}

module.exports = {
	parser: createParser
};

