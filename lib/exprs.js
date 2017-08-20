
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

function DefineExpression(name, expr) {
	this.type = function () { return expr.type(); };
	this.evaluate = function (ctx) {
		if (!ctx.names)
			ctx.names = {};
		
		var value = expr.evaluate(ctx);
		
		ctx.names[name] = { value: value, type: expr.type() };
		
		return value;
	}
	this.compile = function (ctx) {
		return 'var ' + name + ' = ' + expr.compile(ctx) + ';';
	}
}

function createDefine(name, expr) {
	return new DefineExpression(name, expr);
}

function NameExpression(name) {
	this.type = function (ctx) { return ctx.names[name].type; }
	this.evaluate = function (ctx) { return ctx.names[name].value; }
	this.compile = function () { return name; };
}

function createName(name) {
	return new NameExpression(name);
}

module.exports = {
	constant: createConstant,
	
	add: createAdd,
	
	define: createDefine,
	name: createName
};

