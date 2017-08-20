
var TokenType = { Name: 1, Integer: 2, Float: 3 };

function Lexer(text) {
	var l = text.length;
	var p = 0;
	
	this.nextToken = function () {
		skipWhitespaces();
		
		if (p >= l)
			return null;
		
		var ch = text[p++];
		
		if (isDigit(ch))
			return nextNumber(ch);
		
		if (isLetter(ch))
			return nextName(ch);
	}
	
	function isDigit(ch) {
		return ch >= '0' && ch <= '9';
	}
	
	function isLetter(ch) {
		return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
	}
	
	function nextNumber(digit) {
		var value = digit;
		
		while (p < l && isDigit(text[p]))
			value += text[p++];
		
		if (text[p] === '.')
			return nextFloat(value + text[p++]);
		
		return { type: TokenType.Integer, value: value };
	}
	
	function nextFloat(value) {
		while (p < l && isDigit(text[p]))
			value += text[p++];

		return { type: TokenType.Float, value: value };
	}
	
	function nextName(letter) {
		var value = letter;
		
		while (p < l && isLetter(text[p]))
			value += text[p++]
		
		return { type: TokenType.Name, value: value };
	}
	
	function skipWhitespaces() {
		while (p < l && text[p] <= ' ')
			p++;
	}
}

function createLexer(text) {
	return new Lexer(text);
}

module.exports = {
	lexer: createLexer,
	TokenType: TokenType
}