
var types = require('./types');
var exprs = require('./exprs');
var lexers = require('./lexers');
var TokenType = lexers.TokenType;

function Parser(text) {
	var lexer = lexers.lexer(text);
	
	this.nextExpression = function () {
		var token = lexer.nextToken();
		
		if (token == null || token.type === TokenType.EndOfExpression)
			return null;
		
		if (token.type === TokenType.Integer)
			return exprs.constant(parseInt(token.value), types.Int);
		
		if (token.type === TokenType.Float)
			return exprs.constant(parseFloat(token.value), types.Float);

		if (token.type === TokenType.String)
			return exprs.constant(token.value, types.String);
	}
}

function createParser(text) {
	return new Parser(text);
}

module.exports = {
	parser: createParser
};