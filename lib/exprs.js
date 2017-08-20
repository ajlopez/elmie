
function ConstantExpression(value, type) {
	this.evaluate = function () { return value; }
	this.type = function () { return type; }
}

function createConstant(value, type) {
	return new ConstantExpression(value, type);
}

module.exports = {
	constant: createConstant
};