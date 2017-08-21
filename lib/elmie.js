
var parsers = require('./parsers');

function compileText(text) {
	var parser = parsers.parser(text, {});
	
	var result = [];
	
	for (var expr = parser.nextExpression(); expr; expr = parser.nextExpression())
		result.push(expr.compile());
	
	result = result.join(';\n') + ';\n';
	
	return result;
}

module.exports = {
	compile: compileText
};
