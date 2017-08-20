
var types = require('./types');

function createValue(native, isfloat) {
	if (typeof native === 'number')
		if (Number.isInteger(native) && !isfloat)
			return { value: native, type: types.Int };
		else
			return { value: native, type: types.Float };
}

module.exports = {
	value: createValue
};