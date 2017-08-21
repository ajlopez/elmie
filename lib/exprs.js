
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
	
	this.evaluate = function () { return left.evaluate() + right.evaluate(); }
	this.type = function () { return types.Number; }
	this.compile = function () { return left.compile() + ' + ' + right.compile(); }
}

function createAdd(left, right) {
	return new AddExpression(left, right);
}

function DefineExpression(name, expr) {
	var type = expr.type();
	
	this.type = function () { return type; };
	
	this.evaluate = function (ctx) {
		if (!ctx.names)
			ctx.names = {};
		
		var value = expr.evaluate(ctx);
		
		ctx.names[name] = value;
		
		return value;
	}
	
	this.compile = function (ctx) {
		return 'var ' + name + ' = ' + expr.compile(ctx) + ';';
	}
}

function createDefine(name, expr) {
	return new DefineExpression(name, expr);
}

function NameExpression(name, type) {
	this.type = function () { return type; }
	this.evaluate = function (ctx) { return ctx.names[name]; }
	this.compile = function () { return name; };
}

function createName(name, type) {
	return new NameExpression(name, type);
}

function ApplyExpression(exprs) {
	var type = exprs[0].type();
	
	for (var k = 1; k < exprs.length; k++)
		type = type.output();
	
	this.type = function () { return type; };
	
	this.evaluate = function (ctx) {
		var fn = exprs[0].evaluate(ctx);
		var args = [];
		
		for (var k = 1; k < exprs.length; k++)
			args.push(exprs[k].evaluate(ctx));
		
		return fn.apply(null, args);
	}
	
	this.compile = function (ctx) {
		var code = exprs[0].compile(ctx);
		
		code += '(';
		
		for (var k = 1; k < exprs.length; k++) {
			if (k > 1)
				code += ', ';
			
			code += exprs[k].compile(ctx);
		}
		
		code += ')';
		
		return code;
	}
}

function createApply(exprs) {
	return new ApplyExpression(exprs);
}

function DotExpression(left, right) {
	this.evaluate = function (ctx) {
		return left.evaluate(ctx)[right.compile()];
	}
	
	this.compile = function () {
		return left.compile() + '.' + right.compile();
	}
}

function createDot(left, right) {
	return new DotExpression(left, right);
}

module.exports = {
	constant: createConstant,
	
	add: createAdd,
	
	define: createDefine,
	name: createName,
	apply: createApply,
	dot: createDot
};

