
var types = require('./types.js');

function ConstantExpression(value, type) {
	this.evaluate = function () { return value; }
	this.type = function () { return type; }
	this.compile = function () { return JSON.stringify(value); }
}

function createConstant(value, type) {
	return new ConstantExpression(value, type);
}

function AddExpression(left, right) {
	if (!types.numeric(left.type()) || !types.numeric(right.type()))
		throw new Error('Invalid operation');
	
	var type;
	
	if (left.type() === types.Number || right.type() === types.Number)
		type = types.Number;
	else if (left.type() === types.Float || right.type() === types.Float)
		type = types.Float;
	else
		type = types.Int;
	
	this.evaluate = function () { return left.evaluate() + right.evaluate(); }
	this.type = function () { return type; }
	this.compile = function () { return left.compile() + ' + ' + right.compile(); }
}

function createAdd(left, right) {
	return new AddExpression(left, right);
}

module.exports = {
	constant: createConstant,
	add: createAdd
};