
function ConstantExpression(value, type) {
	this.evaluate = function () { return value; }
	this.type = function () { return type; }
	this.compile = function () { return JSON.stringify(value); }
}

function createConstant(value, type) {
	return new ConstantExpression(value, type);
}

module.exports = {
	constant: createConstant
};