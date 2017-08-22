
function PrimitiveType(name) {
	this.toString = function () { return name; };
	this.equals = function (type) { return this === type; };
	this.match = function (type) { return this.equals(type); };
}

var stringType = new PrimitiveType('String');

// numeric types
var intType = new PrimitiveType('Int');
var floatType = new PrimitiveType('Float');
var numberType = new PrimitiveType('number');

intType.match = floatType.match = numberType.match = function (type) { return type === numberType || this.equals(type); };

var strings = {
	String: stringType,
	Int: intType,
	Float: floatType,
	number: numberType
}

function FunctionType(input, output) {
	this.input = function () { return input; };
	this.output = function () { return output; };
	
	this.toString = function () {
		return input.toString() + ' -> ' + output.toString();
	}
	
	this.accepts = function (type) {
		if (type instanceof FunctionType) {
			if (!areEqual(input, type.input()))
				return false;
			
			if (output instanceof FunctionType)
				return output.accepts(type.output());
			
			return false;
		}
			
		return areEqual(input, type);
	}
	
	this.equals = function (type) {
		if (!(type instanceof FunctionType))
			return false;
		
		return input.equals(type.input()) && output.equals(type.output());
	}
	
	this.match = function (type) { return this.equals(type); };
}

function ListType(type) {
	this.type = function () { return type; };
	
	this.equals = function (tp) {
		if (tp instanceof ListType)
			return type.equals(tp.type());
		
		return false;
	}
	
	this.match = function (type) { return this.equals(type); };
}

function createFunctionType(input, output) {
	return new FunctionType(input, output);
}

function createListType(type) {
	return new ListType(type);
}

function areEqual(type1, type2) {
	if (type1 === type2)
		return true;
	
	if (type1 instanceof FunctionType && type2 instanceof FunctionType)
		return areEqual(type1.input(), type2.input()) && areEqual(type1.output(), type2.output());
	
	if (type1 instanceof ListType && type2 instanceof ListType)
		return areEqual(type1.type(), type2.type());

	return false;
}

function isNumeric(type) {
	return type === intType || type === floatType || type === numberType;
}

function fromString(text) {
	return strings[text];
}

module.exports = {
	String: stringType,
	Int: intType,
	Float: floatType,
	Number: numberType,
	
	func: createFunctionType,
	list: createListType,
	
	equal: areEqual,
	numeric: isNumeric,
	
	fromString: fromString	
};

