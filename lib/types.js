
var stringType = new Object();
var intType = new Object();
var floatType = new Object();
var numberType = new Object();

function FunctionType(input, output) {
	this.input = function () { return input; };
	this.output = function () { return output; };
}

function createFunctionType(input, output) {
	return new FunctionType(input, output);
}

function areEqual(type1, type2) {
	if (type1 === type2)
		return true;
	
	if (type1 instanceof FunctionType && type2 instanceof FunctionType)
		return areEqual(type1.input(), type2.input()) && areEqual(type1.output(), type2.output());
	
	return false;
}

module.exports = {
	String: stringType,
	Int: intType,
	Float: floatType,
	Number: numberType,
	
	func: createFunctionType,
	equal: areEqual
};

