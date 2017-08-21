
var parsers = require('./parsers');

function compileText(text) {
	var parser = parsers.parser(text, {});
	
	var result = [];
	
	for (var expr = parser.parseExpression(); expr != null; expr = parser.parseExpression())
		if (expr)
			result.push(expr.compile());
	
	result = result.join(';\n') + ';\n';
	
	return result;
}

module.exports = {
	compile: compileText
};
