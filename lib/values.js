
var types = require('./types');

function createValue(native, isfloat) {
	var type = typeof native;
	
	if (type === 'number')
		if (Number.isInteger(native) && !isfloat)
			return { value: native, type: types.Int };
		else
			return { value: native, type: types.Float };
	else if (type === 'string')
		return { value: native, type: types.String };
}

module.exports = {
	value: createValue
};