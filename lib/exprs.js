
var types = require('./types.js');

function compile(expr) {
	var code = expr.compile();
	
	if (expr instanceof ConstantExpression)
		return code;
	
	return '(' + code + ')';
}

function ConstantExpression(value, type) {
	this.evaluate = function () { return value; }
	this.type = function () { return type; }
	this.compile = function () { return JSON.stringify(value); }
}

function createConstant(value, type) {
	return new ConstantExpression(value, type);
}

function BinaryOperatorExpression(left, oper, right) {
	if (!types.numeric(left.type()) || !types.numeric(right.type()))
		throw new Error('Invalid operation');
	
	this.evaluate = function () { return eval(left.evaluate() + oper + right.evaluate()); }
	this.type = function () { return types.Number; }
	this.compile = function () { return compile(left) + ' ' + oper + ' ' + compile(right); }
}

function createAdd(left, right) {
	return new BinaryOperatorExpression(left, '+', right);
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
	
	this.compile = function () {
		return 'var ' + name + ' = ' + expr.compile();
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
	
	for (var k = 1; k < exprs.length && type; k++)
		type = type.output();
	
	this.type = function () { return type; };
	
	this.evaluate = function (ctx) {
		var fn = exprs[0].evaluate(ctx);
		var args = [];
		
		for (var k = 1; k < exprs.length; k++)
			args.push(exprs[k].evaluate(ctx));
		
		return fn.apply(null, args);
	}
	
	this.compile = function () {
		var code = exprs[0].compile();
		
		code += '(';
		
		for (var k = 1; k < exprs.length; k++) {
			if (k > 1)
				code += ', ';
			
			code += exprs[k].compile();
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
		var leftcode = left.compile();
		
		if (leftcode === 'Native')
			return right.compile();
		
		return leftcode + '.' + right.compile();
	}
	
	this.type = function () {};
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

