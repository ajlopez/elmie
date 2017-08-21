
function Context() {
	var types = {};
	var values = {};
	
	this.type = function (name, type) {
		if (type)
			types[name] = type;
		else
			return types[name];
	};
	
	this.value = function (name, type) {
		if (type)
			values[name] = type;
		else
			return values[name];
	};
}

function createContext() {
	return new Context();
}

module.exports = {
	context: createContext
};

