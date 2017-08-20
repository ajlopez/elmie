
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
	return type1 === type2;
}

module.exports = {
	String: stringType,
	Int: intType,
	Float: floatType,
	Number: numberType,
	
	func: createFunctionType,
	equal: areEqual
};

