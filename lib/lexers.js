
var TokenType = { Name: 1, Integer: 2, Float: 3, String: 4, Symbol: 5, Delimiter: 6 };

var delimiters = [ '[', ']', ',' ];

function Lexer(text) {
	var l = text.length;
	var p = 0;
	
	this.nextToken = function () {
		skipWhitespaces();
		
		if (p >= l)
			return null;
		
		var ch = text[p++];
		
		if (ch === '"')
			if (text[p] == '"' && text[p + 1] == '"') {
				p += 2;
				return nextMultilineString();
			}
			else
				return nextString();
		
		if (ch === '_' || isLetter(ch))
			return nextName(ch);
		
		if (isDigit(ch))
			return nextNumber(ch);
		
		if (isDelimiter(ch))
			return { type: TokenType.Delimiter, value: ch };
		
		if (isSymbol(ch))
			return nextSymbol(ch);
	}
	
	function isDelimiter(ch) {
		return delimiters.indexOf(ch) >= 0;
	}
	
	function isSymbol(ch) {
		return !isDigit(ch) && !isLetter(ch) && ch !== '_' && !isWhitespace(ch) && !isEndOfLine(ch);
	}
	
	function isDigit(ch) {
		return ch >= '0' && ch <= '9';
	}
	
	function isLetter(ch) {
		return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
	}
	
	function nextString() {
		var value = '';
		
		while (p < l && text[p] !== '"' && !isEndOfLine(text[p]))
			value += text[p++];
		
		if (text[p] !== '"')
			throw new Error('Unclosed String');
		
		p++;
		
		return { type: TokenType.String, value: value };
	}
	
	function nextMultilineString() {
		var value = '';
		
		while (p < l && (text[p] !== '"' || text[p + 1] !== '"' || text[p + 2] !== '"'))
			value += text[p++];
		
		if (text[p] !== '"')
			throw new Error('Unclosed String');
		
		p += 3;
		
		return { type: TokenType.String, value: value };
	}
	
	function nextSymbol(ch) {
		var value = ch;
		
		while (p < l && isSymbol(text[p]))
			value += text[p++];
		
		return { type: TokenType.Symbol, value: value };
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
		
		while (p < l && isNameCharacter(text[p]))
			value += text[p++]
		
		return { type: TokenType.Name, value: value };
	}
	
	function isEndOfLine(ch) {
		return ch === '\n' || ch === '\r';
	}
	
	function isNameCharacter(ch) {
		return ch === '_' || isDigit(ch) || isLetter(ch);
	}
	
	function isWhitespace(ch) {
		return ch <= ' ';
	}
	
	function skipWhitespaces() {
		while (p < l && isWhitespace(text[p]))
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